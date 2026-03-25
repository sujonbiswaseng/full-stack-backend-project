import AppError from "../../errorHelper/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateParticipantInput } from "./participants.interface";

 const createParticipantService = async (userId:string,eventId:string,data: ICreateParticipantInput) => {

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
  const finalPayment = paymentStatus || "PENDING";

  if (finalStatus === "APPROVED" && finalPayment === "PENDING") {
    throw new AppError(400,"Cannot approve participant before payment is completed");
  }
  if (finalStatus === "REJECTED" && finalPayment === "SUCCESS") {
    throw new AppError(400,"Rejected participant cannot have SUCCESS payment");
  }

  // Step 3: Create participant
  const participant = await prisma.participant.create({
    data: {
      userId,
      eventId,
      status: finalStatus,
      paymentStatus: finalPayment,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      event: { select: { id: true, title: true, date: true, venue: true } },
    },
  });

  return participant;
};


 const getAllParticipantsService = async () => {
  const result= await prisma.participant.findMany({
    include: {
      user: { select: { id: true, name: true, email: true ,image:true} },
      event: { select: { id: true, title: true, date: true, venue: true} },
    },
    orderBy: {
      joinedAt: "desc",
    },
  });
  if(!result.length){
    throw new AppError(400,'participant user not found')
  }
  return result
};


const getSingleParticipantService = async (id: string) => {
  return await prisma.participant.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true,role:true, email: true,image:true } },
      event: { select: { id: true, title: true, date: true, venue: true } },
    },
  });
};

const UpdateParticipantService = async (id: string,data:Partial<ICreateParticipantInput>) => {
  const existsParticipant= await prisma.participant.findUnique({
    where: { id }
  });
  if(!existsParticipant){
    throw new AppError(404,'participant not found')
  }
  const result = await prisma.participant.update({
    where:{
        id:id
    },
    data:{
        status:data.status,
        paymentStatus:data.paymentStatus
    }
  })
  return result
};
export const ParticipantService={
    createParticipantService,
    getAllParticipantsService,
    getSingleParticipantService,
    UpdateParticipantService
    
}