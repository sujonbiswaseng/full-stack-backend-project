import { prisma } from "../../lib/prisma";

export const getUserNotificationsService = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};