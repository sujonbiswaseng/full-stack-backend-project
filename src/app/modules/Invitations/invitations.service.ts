import AppError from "../../errorHelper/AppError";
import { prisma } from "../../lib/prisma";
import { IInvitationInput, IUpdateInvitationInput } from "./invitations.interface";

export const createInvitationService = async (
  eventId: string,
  inviterId: string,
  data: IInvitationInput
) => {
  const { inviteeId, message } = data;

  const validUsers = await prisma.user.findMany({
    where: { id: { in: inviteeId } },
    select: { id: true },
  });

  const validUserIds = validUsers.map(u => u.id);
  const invalidIds = inviteeId.filter(id => !validUserIds.includes(id));
  if (invalidIds.length) {
    throw new AppError(
      400,
      `These invitee IDs do not exist: ${invalidIds.join(", ")}`
    );
  }

  const existingInvitations = await prisma.invitation.findMany({
    where: {
      eventId,
      inviterId,
      inviteeId: { in: inviteeId },
    },
    select: { inviteeId: true },
  });

  const existingIds = existingInvitations.map(inv => inv.inviteeId);
  const newInvitees = inviteeId.filter(id => !existingIds.includes(id));

  if (newInvitees.length === 0) {
    throw new AppError(
      400,
      `All specified users have already been invited: ${existingIds.join(", ")}`
    );
  }

  const invitations = await Promise.all(
    newInvitees.map(inviteeId =>
      prisma.invitation.create({
        data: {
          eventId,
          inviterId,
          inviteeId,
        },
      })
    )
  );

  const notifications = await Promise.all(
    invitations.map(inv =>
      prisma.notification.create({
        data: {
          userId: inv.inviteeId,
          message: message || "You have a new invitation for an event.",
          type: "INVITATION",
          invitationId: inv.id,
        },
      })
    )
  );

  return { invitations, notifications };
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

const updateInvitationService = async (
  id: string,
  data: IUpdateInvitationInput,
  userRole: "ADMIN" | string
) => {
  const invitation = await prisma.invitation.findUnique({ where: { id } });
  if (!invitation) throw new Error(`Invitation with id ${id} not found`);

  let updateData: any = {};

  if (userRole === "ADMIN") {
    updateData = data;
  } else {
    if (!Object.prototype.hasOwnProperty.call(data, "status")) {
      throw new Error("Users are allowed to update status only.");
    }
    updateData.status = data.status;
  }

  const updated = await prisma.invitation.update({
    where: { id },
    data: updateData,
    include: {
      event: { select: { id: true, title: true, date: true, venue: true } },
      inviter: { select: { id: true, name: true, email: true } },
      invitee: { select: { id: true, name: true, email: true } },
    },
  });

  await prisma.notification.deleteMany({ where: { invitationId: id } });

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
