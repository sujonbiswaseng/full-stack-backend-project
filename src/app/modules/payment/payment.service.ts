// service for payment module

import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "../../../generated/prisma/enums";
import { parseDateForPrisma } from "../../utils/parseDate";

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

      await prisma.$transaction(async (tx) => {
        await tx.participant.update({
          where: {
            id: participantId,
          },
          data: {
            paymentStatus:
              session.payment_status === "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
          },
        });

        await tx.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            stripeEventId: event.id,
            status:
              session.payment_status === "paid"
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
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

      console.log(
        `Checkout session ${session.id} expired. Marking associated payment as failed.`,
      );
      break;
    }
    case "payment_intent.succeeded": {
      const session = event.data.object;
      console.log(
        `Payment intent ${session.id} failed. Marking associated payment as failed.`,
      );
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
    throw new Error("Payment not found");
  }

  // Check the participant and payment status logic
  if (!payment.participant) {
    throw new Error("Associated participant not found");
  }



  // Update the payment status
  // Update payment and associated participant status in a single transaction
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





export const PaymentService = {
    handlerStripeWebhookEvent,
    getAllPaymentsService,
    updatePaymentStatusWithParticipantCheck
}