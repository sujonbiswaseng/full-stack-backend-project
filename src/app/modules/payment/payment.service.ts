// service for payment module

import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "../../../generated/prisma/enums";
import { parseDateForPrisma } from "../../utils/parseDate";
import AppError from "../../errorHelper/AppError";

const deleteParticipantAndPayment = async (
  participantId?: string,
  paymentId?: string,
) => {
  if (!participantId || !paymentId) {
    console.error("Missing participantId or paymentId in session metadata");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.deleteMany({
      where: { id: paymentId },
    });

    await tx.participant.deleteMany({
      where: { id: participantId },
    });
  });

  console.log(
    `Payment failed. Deleted participant ${participantId} and payment ${paymentId}`,
  );
};

const deleteParticipantAndPaymentByIds = async (
  participantId: string,
  paymentId: string,
) => {
  await deleteParticipantAndPayment(participantId, paymentId);
  return { message: "Payment canceled. Payment and participant deleted." };
};

const cleanupAllUnpaidPayments = async () => {
  const unpaidPayments = await prisma.payment.findMany({
    where: { status: PaymentStatus.UNPAID },
    select: { id: true, participantId: true },
  });

  if (!unpaidPayments.length) {
    return { deletedPayments: 0, deletedParticipants: 0 };
  }

  const paymentIds = unpaidPayments.map((p) => p.id);
  const participantIds = unpaidPayments.map((p) => p.participantId);

  const [deletedPayments, deletedParticipants] = await prisma.$transaction([
    prisma.payment.deleteMany({
      where: { id: { in: paymentIds } },
    }),
    prisma.participant.deleteMany({
      where: { id: { in: participantIds } },
    }),
  ]);

  return {
    deletedPayments: deletedPayments.count,
    deletedParticipants: deletedParticipants.count,
  };
};

const handlerStripeWebhookEvent = async (event: Stripe.Event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id,
    },
  });
  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping`);
    return { message: `Event ${event.id} already processed. Skipping` };
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const participantId = session.metadata?.participantId;
      const paymentId = session.metadata?.paymentId;

      if (!participantId || !paymentId) {
        console.error("Missing appointmentId or paymentId in session metadata");
        return {
          message: "Missing appointmentId or paymentId in session metadata",
        };
      }

      const participant = await prisma.participant.findUnique({
        where: {
          id: participantId,
        },
      });
      if (!participant) {
        console.error(`Appointment with id ${participantId} not found`);
        return { message: `Appointment with id ${participantId} not found` };
      }

      if (session.payment_status !== "paid") {
        await deleteParticipantAndPayment(participantId, paymentId);
        break;
      }

      await prisma.$transaction(async (tx) => {
        await tx.participant.update({
          where: {
            id: participantId,
          },
          data: {
            paymentStatus: PaymentStatus.PAID,
          },
        });

        await tx.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            stripeEventId: event.id,
            status: PaymentStatus.PAID,
            paymentGatewayData: session as any,
          },
        });
      });

      console.log(
        `Processed checkout.session.completed for appointment ${participantId} and payment ${paymentId}`,
      );
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      const participantId = session.metadata?.participantId;
      const paymentId = session.metadata?.paymentId;
      await deleteParticipantAndPayment(participantId, paymentId);
      break;
    }

    case "payment_intent.succeeded": {
      const session = event.data.object;
      console.log(
        `Payment intent ${session.id} succeeded.`,
      );
      break;
    }
    case "payment_intent.payment_failed": {
      const session = event.data.object;
      const participantId = session.metadata?.participantId;
      const paymentId = session.metadata?.paymentId;
      await deleteParticipantAndPayment(participantId, paymentId);
      break;
    }
    case "checkout.session.async_payment_failed":{
      const session = event.data.object;
      const participantId = session.metadata?.participantId;
      const paymentId = session.metadata?.paymentId;
      await deleteParticipantAndPayment(participantId, paymentId);
      break;
    }
    case "payment_intent.canceled":{
      const session = event.data.object;
      const participantId = session.metadata?.participantId;
      const paymentId = session.metadata?.paymentId;

      await deleteParticipantAndPayment(participantId, paymentId);
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return {message : `Webhook Event ${event.id} processed successfully`}
};



const getAllPaymentsService = async (
  userId: string,
  page: number,
  limit: number,
  skip: number,
  sortBy: string,
  sortOrder: string,
  query: any
) => {
  await cleanupAllUnpaidPayments();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  if (user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admin can access all payments");
  }
  const filters: any[] = [];
  if (query.status) filters.push({ status: query.status });
  if (query.amount) filters.push({ amount: Number(query.amount) });
  if (query.paymentStatus) filters.push({ status: query.paymentStatus });
  if (query.createdAt) {
    const dateRange = parseDateForPrisma(query.createdAt);
    filters.push({ createdAt: dateRange });
  }
  if (query.userId) filters.push({ userId: query.userId });
  if (query.eventId) filters.push({ eventId: query.eventId });

  const whereOptions = filters.length ? { AND: filters } : {};;


  // Only admin can view all payments
  const payments = await prisma.payment.findMany({
    where: whereOptions,
    skip,
    take: limit,
    orderBy: {"createdAt":"desc" },
    include:{
      event:true,
      participant:true,
      user:true
    },
  });
  const total = await prisma.payment.count({ where: whereOptions });
  return {
    payments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};


const updatePaymentStatusWithParticipantCheck = async (
  paymentId: string,
  newStatus: string
) => {
  // Find the payment
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { participant: true }
  });
  if (!payment) {
    throw new AppError(404,"Payment not found");
  }

  // Check the participant and payment status logic
  if (!payment.participant) {
    throw new AppError(404,"Associated participant not found");
  }

  // If status is UNPAID, remove both payment and participant.
  if (newStatus.toUpperCase() === PaymentStatus.UNPAID) {
    const [deletedPayment, deletedParticipant] = await prisma.$transaction([
      prisma.payment.delete({
        where: { id: paymentId },
      }),
      prisma.participant.delete({
        where: { id: payment.participant.id },
      }),
    ]);

    return {
      payment: deletedPayment,
      participant: deletedParticipant,
      message: "Payment is UNPAID, so payment and participant were deleted",
    };
  }



  const [updatedPayment, updatedParticipant] = await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: { status: newStatus as any }
    }),
    prisma.participant.update({
      where: { id: payment.participant.id },
      data: { paymentStatus: newStatus as any }
    })
  ]);


  return {
    payment: updatedPayment,
    participant: updatedParticipant
  };
};

const deletePayment = async (paymentId: string) => {
  // Find the payment
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { participant: true }
  });
  if (!payment) {
    throw new Error("Payment not found");
  }

  // Check if participant is associated
  if (!payment.participant) {
    throw new Error("Associated participant not found");
  }

  const [deletedPayment, deletedParticipant] = await prisma.$transaction([
    prisma.payment.delete({
      where: { id: paymentId }
    }),
    prisma.participant.delete({
      where: { id: payment.participant.id },
    })
  ]);

  return {
    payment: deletedPayment,
    participant: deletedParticipant
  };
};




export const PaymentService = {
    handlerStripeWebhookEvent,
    getAllPaymentsService,
    updatePaymentStatusWithParticipantCheck,
    deletePayment,
    deleteParticipantAndPaymentByIds
}