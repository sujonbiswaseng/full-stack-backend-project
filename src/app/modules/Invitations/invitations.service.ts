import AppError from "../../errorHelper/AppError";
import { prisma } from "../../lib/prisma";
import { IInvitationInput } from "./invitations.interface";

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


export const invitationsServices = {
  createInvitationService,getAllInvitationsService
};
