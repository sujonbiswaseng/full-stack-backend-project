import status from "http-status";
import { PaymentStatus, Role } from "../../../generated/prisma/enums";
import AppError from "../../errorHelper/AppError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";

const getDashboardStatsData = async (user : IRequestUser) => {
    let statsData;
    switch(user.role){
        case Role.ADMIN:
            statsData = getAdminDashboardStats();
            break;
        case Role.USER:
            statsData = getUserDashboardStats(user.userId);
            break;
        default:
            throw new AppError(status.BAD_REQUEST, "Invalid user role");
    }

    return statsData;
}
interface IBarChartData {
  month: string;
  revenue: number;
}

export const getAdminDashboardStats = async () => {
  try {
    const counts = await prisma.$transaction([
      prisma.event.count(),
      prisma.user.count(),
      prisma.participant.count(),
      prisma.invitation.count(),
      prisma.payment.count(),
    ]);

    const [eventCount, userCount, participantCount, invitationCount, paymentCount] = counts;

    // 🔹 Total Revenue
    const revenueResult = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status:PaymentStatus.PAID },
    });
    const totalRevenue = revenueResult._sum.amount ?? 0;

    // 🔹 Event Status Counts
    const [upcomingEvents, completedEvents, cancelledEvents] = await Promise.all([
      prisma.event.count({ where: { status: "UPCOMING" } }),
      prisma.event.count({ where: { status: "COMPLETED" } }),
      prisma.event.count({ where: { status: "CANCELLED" } }),
    ]);

    // 🔹 Dynamic Monthly Revenue
    const payments = await prisma.payment.findMany({
      where: { status: PaymentStatus.PAID },
      select: { amount: true, createdAt: true },
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthlyRevenue: Record<number, number> = {};

    payments.forEach(payment => {
      const month = payment.createdAt.getMonth(); // 0-11
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(payment.amount);
    });

    const barChartData: IBarChartData[] = monthNames.map((month, idx) => ({
      month,
      revenue: monthlyRevenue[idx] ?? 0,
    }));

    // 🔹 Pie Chart for Event Status
    const pieChartData = [
      { label: "Upcoming", value: upcomingEvents },
      { label: "Completed", value: completedEvents },
      { label: "Cancelled", value: cancelledEvents },
    ];

    return {
      counts: {
        participatedEvents: participantCount,
        invitations: invitationCount,
        payments: paymentCount,
      },
      totalRevenue,
      monthlyRevenue: barChartData,
      eventStatus: {
        upcoming: upcomingEvents,
        completed: completedEvents,
        cancelled: cancelledEvents,
      },
      pieChartData,
    };
  } catch (error) {
    console.error("Failed to fetch admin dashboard stats:", error);
    throw new Error("Could not fetch dashboard stats");
  }
};


interface IBarChartData {
  month: string;
  revenue: number;
}

export const getUserDashboardStats = async (userId: string) => {
  try {
    // 🔹 Counts related to user
    const [participatedEventsCount, invitationsCount, paymentsCount] = await prisma.$transaction([
      prisma.participant.count({ where: { userId } }),
      prisma.invitation.count({ where: { inviterId:userId } }),
      prisma.payment.count({ where: { userId } }),
    ]);

    // 🔹 Total paid amount by user
    const revenueResult = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { userId, status: PaymentStatus.PAID },
    });
    const totalRevenue = revenueResult._sum.amount ?? 0;

    // 🔹 Event Status Counts for user's participated events
    const [upcomingEvents, completedEvents, cancelledEvents] = await Promise.all([
      prisma.participant.count({ where: { userId, event: { status: "UPCOMING" } } }),
      prisma.participant.count({ where: { userId, event: { status: "COMPLETED" } } }),
      prisma.participant.count({ where: { userId, event: { status: "CANCELLED" } } }),
    ]);

    // 🔹 Dynamic monthly revenue from user's payments
    const payments = await prisma.payment.findMany({
      where: { userId, status: PaymentStatus.PAID },
      select: { amount: true, createdAt: true },
    });

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthlyRevenue: Record<number, number> = {};

    payments.forEach(payment => {
      const month = payment.createdAt.getMonth();
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(payment.amount);
    });

    const barChartData: IBarChartData[] = monthNames.map((month, idx) => ({
      month,
      revenue: monthlyRevenue[idx] ?? 0,
    }));

    // 🔹 Pie chart for participated events status
    const pieChartData = [
      { label: "Upcoming", value: upcomingEvents },
      { label: "Completed", value: completedEvents },
      { label: "Cancelled", value: cancelledEvents },
    ];

    return {
      counts: {
        participatedEvents: participatedEventsCount,
        invitations: invitationsCount,
        payments: paymentsCount,
      },
      totalRevenue,
      monthlyRevenue: barChartData,
      eventStatus: {
        upcoming: upcomingEvents,
        completed: completedEvents,
        cancelled: cancelledEvents,
      },
      pieChartData,
    };
  } catch (error) {
    console.error("Failed to fetch user dashboard stats:", error);
    throw new Error("Could not fetch user dashboard stats");
  }
};

export const statsService={ getDashboardStatsData}