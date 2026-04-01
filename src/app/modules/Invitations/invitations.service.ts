import AppError from "../../errorHelper/AppError";
import { prisma } from "../../lib/prisma";
import { parseDateForPrisma } from "../../utils/parseDate";
import { IInvitationInput, IUpdateInvitationInput } from "./invitations.interface";

export const createInvitationService = async (
  inviterId: string,
  data: IInvitationInput
) => {
  const { inviteeId, message,eventId } = data;
  if (!eventId) {
    throw new Error("Event ID is required");
  }
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true },
  });
  if (!event) {
    throw new AppError(404, `Event with id ${eventId} does not exist`);
  }
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

const getUserInvitationsService = async (
  userId: string,
  page?: number,
  limit?: number,
  skip?: number,
  sortBy?: string,
  sortOrder?: string,
  query?: Record<string, any>
) => {
  const userExist = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExist) {
    throw new AppError(404, 'user not found');
  }
  const andConditions: any[] = [];

  if (query) {
    if (query.eventId) {
      andConditions.push({ eventId: query.eventId });
    }
    if (query.inviterId) {
      andConditions.push({ inviterId: query.inviterId });
    }
    if (query.inviteeId) {
      andConditions.push({ inviteeId: query.inviteeId });
    }
    if (query.status) {
      andConditions.push({ status: query.status });
    }
    if (query.createdAt) {
      const dateRange = parseDateForPrisma(query.createdAt);
      andConditions.push({ createdAt:dateRange });
    }
  }


  const [receivedInvitations, sentInvitations] = await Promise.all([
    prisma.invitation.findMany({
      where: { inviteeId: userId, ...(andConditions.length > 0 ? { AND: andConditions } : {}) },
      include: {
        event: true,
        inviter: true,
      },
      orderBy: { [sortBy || "createdAt"]: sortOrder === "asc" ? "asc" : "desc" },
      skip: skip ?? 0,
      take: limit ?? 10,
    }),
    prisma.invitation.findMany({
      where: { inviterId: userId, ...(andConditions.length > 0 ? { AND: andConditions } : {}) },
      include: {
        event: true,
        invitee: true,
      },
      orderBy: { [sortBy || "createdAt"]: sortOrder === "asc" ? "asc" : "desc" },
      skip: skip ?? 0,
      take: limit ?? 10,
    }),
  ]);

  const receivedInvitationsCount = await prisma.invitation.count({
    where: { inviteeId: userId, ...(andConditions.length > 0 ? { AND: andConditions } : {}) },
  });
  const sentInvitationsCount = await prisma.invitation.count({
    where: { inviterId: userId, ...(andConditions.length > 0 ? { AND: andConditions } : {}) },
  });

  return {
    receivedInvitations,
    sentInvitations,
    receivedPagination: {
      total: receivedInvitationsCount,
      page: page ?? 1,
      limit: limit ?? 10,
      totalPages: Math.ceil(receivedInvitationsCount / (limit ?? 10)),
    },
    sentPagination: {
      total: sentInvitationsCount,
      page: page ?? 1,
      limit: limit ?? 10,
      totalPages: Math.ceil(sentInvitationsCount / (limit ?? 10)),
    },
  };
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
) => {
  const invitation = await prisma.invitation.findUnique({ where: { id } });
  if (!invitation) throw new Error(`Invitation with id ${id} not found`);
 const updateInv= await prisma.invitation.update({
    where: { id },
    data,
    select:{
      notifications:{
        select:{
          id:true
        }
      }
    }
  });
  await prisma.notification.deleteMany({
    where: {
      invitationId: id,
      userId: invitation.inviteeId, 
    },
  });

  return updateInv;
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
