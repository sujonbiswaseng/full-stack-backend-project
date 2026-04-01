import { prisma } from "../../lib/prisma";

export const getUserNotificationsService = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    include:{
      user:true,
      invitation:true
    },
    orderBy: { createdAt: "desc" },
  });
};