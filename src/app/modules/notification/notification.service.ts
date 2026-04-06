import { prisma } from "../../lib/prisma";

export const getUserNotificationsService = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    include:{
      user:true,
      invitation:{
        include:{
          event:true
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });
};