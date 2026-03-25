import { v6 as uuidv6 } from 'uuid';
import AppError from "../../errorHelper/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateParticipantInput } from "./participants.interface";
import { stripe } from "../../config/stripe.config";
import { envVars } from "../../config/env";
import { IRequestUser } from "../../interface/requestUser.interface";
import status from "http-status";
import { ParticipantStatus, PaymentStatus } from "../../../generated/prisma/enums";

const createParticipantService = async (
  userId: string,
  eventId: string,
  data: ICreateParticipantInput,
) => {
  const { status, paymentStatus } = data;
  //   check exist participant user
  const existing = await prisma.participant.findFirst({
    where: { userId, eventId },
  });

  if (existing) {
    throw new AppError(409,'User already joined')
  }

  // Step 2: Validate status & paymentStatus combination
  const finalStatus = status || "PENDING";
  const finalPayment = paymentStatus || "UNPAID";

  if (finalStatus === "APPROVED" && finalPayment === "UNPAID") {
    throw new AppError(
      400,
      "Cannot approve participant before payment is completed",
    );
  }
  if (finalStatus === "REJECTED" && finalPayment === "PAID") {
    throw new AppError(400, "Rejected participant cannot have SUCCESS payment");
  }

  // Step 3: Create participant
  const result = await prisma.$transaction(async (tx) => {
    const participantData = await prisma.participant.create({
      data: {
        userId,
        eventId,
        status: finalStatus,
        paymentStatus: finalPayment,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        event: {
          select: { id: true, title: true, date: true, venue: true, fee: true },
        },
      },
    });
    const transactionId =String(uuidv6());
    const paymentData = await tx.payment.create({
      data: {
        participantId: participantData.id,
        amount: participantData.event.fee,
        transactionId: transactionId as string,
        eventId: eventId,
        userId: userId,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: `participants with . ${participantData.event.title}`,
            },
            unit_amount: participantData.event.fee*100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointmentId: participantData.id,
        paymentId: paymentData.id,
      },

      success_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-success`,

      // cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-failed`,
      cancel_url: `${envVars.FRONTEND_URL}/dashboard/appointments`,
    });

    return {
      participantData,
      paymentData,
      paymentUrl: session.url,
    };
  });

  return {
    appointment: result.participantData,
    payment: result.paymentData,
    paymentUrl: result.paymentUrl,
  };
};

const getAllParticipantsService = async () => {
  const result = await prisma.participant.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      event: { select: { id: true, title: true, date: true, venue: true } },
    },
    orderBy: {
      joinedAt: "desc",
    },
  });
  if (!result.length) {
    throw new AppError(400, "participant user not found");
  }
  return result;
};

const getSingleParticipantService = async (id: string) => {
  return await prisma.participant.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, role: true, email: true, image: true },
      },
      event: { select: { id: true, title: true, date: true, venue: true } },
    },
  });
};

const UpdateParticipantService = async (
  id: string,
  data: Partial<ICreateParticipantInput>,
) => {
  const existsParticipant = await prisma.participant.findUnique({
    where: { id },
  });
  if (!existsParticipant) {
    throw new AppError(404, "participant not found");
  }
  const result = await prisma.participant.update({
    where: {
      id: id,
    },
    data: {
      status: data.status,
      paymentStatus: data.paymentStatus,
    },
  });
  return result;
};

const deleteParticipantService = async (id: string) => {
  const existsParticipant = await prisma.participant.findUnique({
    where: { id },
  });
  if (!existsParticipant) {
    throw new AppError(404, "participant not found");
  }
  return await prisma.participant.delete({
    where: { id },
  });
};



const createParticipantPayLater=async( userId: string,
  eventId: string,
  data: ICreateParticipantInput,)=>{

    const { status, paymentStatus } = data;
  //   check exist participant user
  const existing = await prisma.participant.findFirst({
    where: { userId, eventId },
  });

  if (existing) {
    return { message: "User already joined", participant: existing };
  }

  // Step 2: Validate status & paymentStatus combination
  const finalStatus = status || "PENDING";
  const finalPayment = paymentStatus || "UNPAID";

  if (finalStatus === "APPROVED" && finalPayment === "UNPAID") {
    throw new AppError(
      400,
      "Cannot approve participant before payment is completed",
    );
  }
  if (finalStatus === "REJECTED" && finalPayment === "PAID") {
    throw new AppError(400, "Rejected participant cannot have SUCCESS payment");
  }

   const result = await prisma.$transaction(async (tx) => {
     const participantData = await prisma.participant.create({
      data: {
        userId,
        eventId,
        status: finalStatus,
        paymentStatus: finalPayment,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        event: {
          select: { id: true, title: true, date: true, venue: true, fee: true },
        },
      },
    });

    return participantData
   })
   return result


}


const initiatePayment = async (participantId: string, user : IRequestUser) => {
    const userdata = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
        }
    });

    const participantData = await prisma.participant.findUniqueOrThrow({
        where: {
            id: participantId,
            userId: userdata.id,
        },
        include: {
            user: true,
            event : true,
            payment:true,
        }
    });

    if(!participantData){
        throw new AppError(status.NOT_FOUND, "ParticipantData not found");
    }

    if(!participantData.payment){
        throw new AppError(status.NOT_FOUND, "Payment data not found for this participant");
    }

    if(participantData.payment.status === PaymentStatus.PAID){
        throw new AppError(status.BAD_REQUEST, "Payment already completed for this appointment");
    };

    if(participantData.status === ParticipantStatus.REJECTED){
        throw new AppError(status.BAD_REQUEST, "participant is REJECTED");
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: "bdt",
                    product_data: {
                        name: `participant with ${participantData.event.title}`,
                    },
                    unit_amount: participantData.event.fee* 120,
                },
                quantity: 1,
            }
        ],
        metadata: {
            appointmentId: participantData.id,
            paymentId: participantData.payment.id,
        },

        success_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-success?appointment_id=${participantData.id}&payment_id=${participantData.payment.id}`,

        // cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-failed`,
        cancel_url: `${envVars.FRONTEND_URL}/dashboard/appointments?error=payment_cancelled`,
    })

    return {
        paymentUrl: session.url,
    }
}

export const ParticipantService = {
  createParticipantService,
  getAllParticipantsService,
  getSingleParticipantService,
  UpdateParticipantService,
  deleteParticipantService,
  createParticipantPayLater,
  initiatePayment
};
