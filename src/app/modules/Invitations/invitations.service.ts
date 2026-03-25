import AppError from "../../errorHelper/AppError";
import { prisma } from "../../lib/prisma";
import { IInvitationInput, IUpdateInvitationInput } from "./invitations.interface";

// Create Invitation
const createInvitationService = async (
  eventId: string,
  inviterId: string,
  data: IInvitationInput,
) => {

      const existing = await prisma.invitation.findMany({
    where: {
      eventId,
      inviterId,
      inviteeId: { in: data.inviteeId },
    },
    select: { inviteeId: true },
  });
   const existingIds = existing.map(e => e.inviteeId);
   const newInvitees = data.inviteeId.filter(id => !existingIds.includes(id));
   if(!newInvitees.length){
    throw new AppError(400,'invalid input ,plase check your input value')
   }
  const invitations = newInvitees.map((inviteeId) => ({
    eventId: eventId,
    inviterId: inviterId,
    inviteeId,
  }));
   const result = await Promise.all(
    invitations.map(inv =>
      prisma.invitation.create({ data: inv })
    )
  );
  return result;
};

const getAllInvitationsService = async () => {
  return await prisma.invitation.findMany({
    include: {
      event: true,
      inviter: true,
      invitee: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const getUserInvitationsService = async (userId: string) => {
    const userExist=await prisma.user.findUnique({where:{id:userId}})
    if(!userExist){
        throw new AppError(404,'user not found')
    }
  return await prisma.invitation.findMany({
    where: { inviteeId: userId },
    include: {
      event: true,
      inviter: true,
    },
    orderBy: { createdAt: "desc" },
  });
};


 const getSingleInvitationService = async (id: string) => {
  const result= await prisma.invitation.findUnique({
    where: { id },
    include: {
      event: { select: { id: true, title: true, date: true, venue: true }},
      inviter: { select: { id: true, name: true, email: true ,image:true}},
      invitee: { select: { id: true, name: true, email: true ,image:true}},
    },
  });
  if(!result){
    throw new AppError(404,'invitation not found')
  }
  return result
};

 const updateInvitationService = async (id: string, data: IUpdateInvitationInput) => {
  const invitation = await prisma.invitation.findUnique({ where: { id } });
  if (!invitation) throw new Error(`Invitation with id ${id} not found`)

  // Update
  const updated = await prisma.invitation.update({
    where: { id },
    data,
    include: {
      event: { select: { id: true, title: true, date: true, venue: true } },
      inviter: { select: { id: true, name: true, email: true } },
      invitee: { select: { id: true, name: true, email: true } },
    },
  });

  return updated;
};


const deleteInvitationService = async (id: string) => {
  // Check existence
  const invitation = await prisma.invitation.findUnique({ where: { id } });
  if (!invitation) throw new Error(`Invitation with id ${id} not found`);

  return await prisma.invitation.delete({ where: { id } });
};
export const invitationsServices = {
  createInvitationService,getAllInvitationsService,getUserInvitationsService,getSingleInvitationService,deleteInvitationService,updateInvitationService
};
