import { v6 as uuidv6 } from 'uuid';
import AppError from "../../errorHelper/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateParticipantInput } from "./participants.interface";
import { stripe } from "../../config/stripe.config";
import { envVars } from "../../config/env";
import { IRequestUser } from "../../interface/requestUser.interface";
import status from "http-status";
import { ParticipantStatus, PaymentStatus } from "../../../generated/prisma/enums";
import { parseDateForPrisma } from '../../utils/parseDate';

const createParticipantService = async (
  userId: string,
  eventId: string,
  data: ICreateParticipantInput,
) => {
  const existing = await prisma.participant.findFirst({
    where: { userId, eventId },
  });

  if(existing?.status==='BANNED'){
    throw new AppError(status.FORBIDDEN, "You have been banned from participating in this event.");
  }

  if (existing) {
    throw new AppError(409, "User already joined");
  }



  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      title: true,
      fee: true,
      date: true,
      venue: true,
    },
  });

  if (!event) {
    throw new AppError(404, "Event not found");
  }

  if (event.fee < 60) {
    throw new AppError(400, "Minimum amount must be at least 60 BDT");
  }

  const isFree = Number(event.fee) === 0;

  const finalStatus = isFree ? "APPROVED" : "PENDING";
  const finalPayment = isFree ? "PAID" : "UNPAID";

  const result = await prisma.$transaction(async (tx) => {
    // ✅ Create participant
    const participantData = await tx.participant.create({
      data: {
        userId,
        eventId,
        status: finalStatus,
        paymentStatus: finalPayment,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        event: true,
      },
    });

    // 🟢 FREE EVENT → No payment needed
    if (isFree) {
      return {
        participantData,
        paymentData: null,
        paymentUrl: null,
      };
    }

    // 🔴 PAID EVENT → Create payment
    const transactionId = String(uuidv6());

    const paymentData = await tx.payment.create({
      data: {
        participantId: participantData.id,
        amount: event.fee,
        transactionId,
        eventId,
        userId,
      },
    });

    // 💳 Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: `Ticket for ${event.title}`,
            },
            unit_amount: event.fee * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        participantId: participantData.id,
        paymentId: paymentData.id,
      },
      success_url: `${envVars.FRONTEND_URL}/payment/payment-success/${eventId}`,
      cancel_url: `${envVars.FRONTEND_URL}/payment/payment-failed`,
    });

    return {
      participantData,
      paymentData,
      paymentUrl: session.url,
    };
  });

  return {
    participant: result.participantData,
    payment: result.paymentData,
    paymentUrl: result.paymentUrl,
  };
};

const getAllParticipantsService = async (userId:string,page:number,limit:number,skip:number,sortBy:string,sortOrder:string,query:any) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  const EventData=await prisma.event.findMany({where:{
    organizerId:user?.id
  }})

  const eventIds = EventData.map(event => event.id);
  
  if (!user) {
    throw new AppError(404, "User not found");
  }
  const andConditions: any[] = [];

  if (query.status) {
    andConditions.push({
      status: query.status,
    });
  }
  if (query.joinedAt) {
    const dateRange = parseDateForPrisma(query.joinedAt);
    andConditions.push({ joinedAt:dateRange });
  }

  if (query.paymentStatus) {
    andConditions.push({
      paymentStatus: query.paymentStatus,
    });
  }

  const where = andConditions.length > 0 ? { AND: andConditions } : {};

  if(user.role === "ADMIN"){

    const result = await prisma.participant.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        "joinedAt":"desc"
      },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        event: { select: { id: true, title: true, date: true, venue: true } },
      },
    })
    const total = await prisma.participant.count();
    const totalPages = Math.ceil(total / limit);
    return {
      participants: result,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    }

 } else if(user.role === "USER"){
  if(!EventData){
    return null
  }

    const result = await prisma.participant.findMany({      
      skip,
      take: limit,
        orderBy: {
          "joinedAt":"desc"
        },
        where: { ...where, userId: userId,eventId:{in:eventIds}},
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
          event: { select: { id: true, title: true, date: true, venue: true } },
        },
    })
    const total = await prisma.participant.count({
      where: { userId: userId },
    });
    const totalPages = Math.ceil(total / limit);
    return {
       result,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    }
 }
};

const getOwnPaymentParticipantService = async (eventId:string,userId: string) => {
  // Get participant records for the user that have any payment, and include payment info
  const participants = await prisma.participant.findMany({
    where: {
      userId: userId,
      eventId:eventId
    },
    include: {
      payment: true, // Assumes relation "payment" exists in Participant model
      event: { select: { id: true, title: true, date: true, venue: true } },
    },
    orderBy: {
      joinedAt: "desc",
    },
  });
  return participants;
};

const ParticipantOwnRequestEventService = async (userId: string,page:number,limit:number,skip:number,query:any) => {
  // Returns all the events where this user is a participant (requested/approved) -- own requests
  const andConditions: any[] = [];

  if (query.status) {
    andConditions.push({
      status: query.status,
    });
  }
  if (query.joinedAt) {
    const dateRange = parseDateForPrisma(query.joinedAt);
    andConditions.push({ joinedAt:dateRange });
  }

  if (query.paymentStatus) {
    andConditions.push({
      paymentStatus: query.paymentStatus,
    });
  }

  const where = andConditions.length > 0 ? { AND: andConditions } : {};
  const participants = await prisma.participant.findMany({
    where: {
      userId,
      ...where
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          date: true,
          venue: true,
          image: true,
          status: true,
          fee:true
        },
      },
      user:true
      // include other relations if needed
    },
    orderBy: {
      joinedAt: "desc",
    },
  });
  return participants;
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
  userId: string
) => {

  const existsParticipant = await prisma.participant.findUnique({
    where: { id },
  });

  if (!existsParticipant) {
    throw new AppError(404, "Participant not found");
  }

  // user বের করা
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  let updateData: any = {};
  if (user.role === "USER") {
    updateData.status = data.status;
  }

  if (user.role === "ADMIN") {
    updateData.status = data.status;
    updateData.paymentStatus = data.paymentStatus;
  }

  const result = await prisma.participant.update({
    where: { id },
    data: updateData,
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


const deleteEventRequestJoinData = async (id: string) => {
  // Find the participant first
  const participant = await prisma.participant.findUnique({
    where: { id },
  });

  if (!participant) {
    throw new AppError(404, "participant not found");
  }

  if (participant.status !== "PENDING") {
    throw new AppError(400, "Only event request participants with status 'PENDING' can be deleted");
  }

  return await prisma.participant.delete({
    where: { id },
  });
};


const createParticipantPayLater=async( userId: string,
  eventId: string)=>{

  const existing = await prisma.participant.findFirst({
    where: { userId, eventId },
  });
  if(existing?.status==="PENDING"){
    throw new AppError(400, "User already requested to join and is pending approval");
  }
  if(existing?.status==="APPROVED"){
    throw new AppError(400, `User already joined and approved for this event`);
  }

  if(existing?.status==="BANNED"){
    throw new AppError(400, "User is banned from joining this event");
  }


  if (existing) {
    return { message: "User already requested join", participant: existing };
  }


   const result = await prisma.$transaction(async (tx) => {
     const participantData = await prisma.participant.create({
      data: {
        userId,
        eventId,
        status: "PENDING",
        paymentStatus: "UNPAID",
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


const initiatePayment = async (eventId: string, user : IRequestUser) => {
    const userdata = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
        }
    });
    // Check that the event exists, is active and is accepting participants
    const event = await prisma.event.findUnique({
        where: {
            id: eventId,
        },
    });


    
    if (!event) {
        throw new AppError(status.NOT_FOUND, "Event not found");
    }
    if (event.fee < 60) {
      throw new AppError(400, "Minimum amount must be at least 60 BDT");
    }
    
    const participantData = await prisma.participant.findFirst({
        where: {
            eventId: event.id,
            userId: userdata.id,
        },
        include: {
            user: true,
            event : true,
            payment:true,
        }
    });
    if (!participantData) {
        throw new AppError(status.NOT_FOUND, "Participant not found for payment initiation");
    }
    if (participantData.payment) {
      throw new AppError(status.BAD_REQUEST, "Payment has already been initiated for this participant. Please proceed with the existing payment or contact support for assistance.");
  }
    if(participantData.status === ParticipantStatus.REJECTED){
      throw new AppError(status.BAD_REQUEST, "participant is REJECTED");
  }
    const result = await prisma.$transaction(async (tx) => {
      // 🔴 PAID EVENT → Create payment
      const transactionId = String(uuidv6());
  
      const paymentData = await tx.payment.create({
        data: {
          participantId: participantData.id,
          amount: event.fee,
          transactionId,
          eventId,
          userId:user.userId,
        },
      });

      if(!paymentData){
        throw new AppError(status.NOT_FOUND, "Payment data not found for this participant");
    }
      // 💳 Stripe session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "bdt",
              product_data: {
                name: `Ticket for ${event.title}`,
              },
              unit_amount: event.fee * 100,
            },
            quantity: 1,
          },
        ],
        metadata: {
          participantId: participantData.id,
          paymentId: paymentData.id,
        },
        success_url: `${envVars.FRONTEND_URL}/payment/payment-success/${eventId}`,
        cancel_url: `${envVars.FRONTEND_URL}/payment/payment-failed`,
      });
  
      return {
        participantData,
        paymentData,
        paymentUrl: session.url,
      };
    });

    return {
      participant: result.participantData,
      payment: result.paymentData,
      paymentUrl: result.paymentUrl,
    };

}

export const ParticipantService = {
  createParticipantService,
  getAllParticipantsService,
  getSingleParticipantService,
  UpdateParticipantService,
  deleteParticipantService,
  createParticipantPayLater,
  initiatePayment,
  getOwnPaymentParticipantService,
  ParticipantOwnRequestEventService,
  deleteEventRequestJoinData
};
