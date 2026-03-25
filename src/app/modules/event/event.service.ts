import status from "http-status";
import AppError from "../../errorHelper/AppError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { ICreateEvent, IUpdateEventInput } from "./event.interface";

const createEvent = async (user: IRequestUser, payload: ICreateEvent) => {
  const { description, date, time, title, visibility, venue, fee, categories } =
    payload;
  const event = await prisma.event.create({
    data: {
      title,
      description,
      date,
      time,
      categories: payload.categories,
      venue,
      visibility,
      fee,
      organizerId: user.userId,
    },
  });

  return event;
};

const getAllEvents = async () => {
  const statuses = [
    "DRAFT",
    "UPCOMING",
    "ONGOING",
    "COMPLETED",
    "CANCELLED",
  ] as const;

  const result: any = {};

  for (const status of statuses) {
    const events = await prisma.event.findMany({
      where: { status },
      include: {
        reviews: {
          where: { rating: { gt: 0 } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    result[status] = events.map((event) => {
      const totalReviews = event.reviews.length;
      const avgRating =
        totalReviews > 0
          ? event.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          : 0;

      return { ...event, avgRating, totalReviews };
    });
  }

  return result;
};

const getSingleEvent = async (eventId: string) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      reviews: {
        where: {
          rating: {
            gt: 0,
          },
        },
      },
    },
  });

  if (!event) {
    throw new AppError(404, "event not found");
  }
  const totalReviews = event.reviews.length || 0;
  const avgRating =
    totalReviews > 0
      ? event.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  return {
    ...event,
    avgRating,
    totalReviews,
  };
};

const updateEvent = async (eventId: string, payload: IUpdateEventInput) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new AppError(404, "Event not found");
  }
  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: {
      title: payload.title,
      description: payload.description,
      time: payload.time,
      date: payload.date,
      fee: payload.fee,
      visibility: payload.visibility,
      venue: payload.venue,
      status: payload.status,
      categories: payload.categories,
    },
  });

  return updatedEvent;
};

const DeleteEvent = async (user: IRequestUser, eventId: string) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });
  if (!event) {
    throw new AppError(404, "Event not found");
  }
  //  User cannot delete others' events
  if (user.role !== "ADMIN" && event.organizerId !== user.userId) {
    throw new AppError(400, "the event is not own event");
  }

  //  Only ADMIN can deleted these
  if (user.role === "ADMIN") {
    const Deletedevent = await prisma.event.delete({
      where: { id: eventId },
    });
    return Deletedevent;
  }

  const Deletedevent = await prisma.event.delete({
    where: { id: eventId },
  });

  return Deletedevent;
};

export const EventServices = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  DeleteEvent,
};
