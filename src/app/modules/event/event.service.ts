import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { ICreateEvent } from "./event.interface";

const createEvent = async (user: IRequestUser, payload: ICreateEvent) => {
  const {description,date,time,title,visibility,venue,fee} = payload;
  const event = await prisma.event.create({
    data: {
      title,
      description,
      date,
      time,
      venue,
      visibility,
      fee,
      organizerId: user.userId,
    },
  });

  return event;
};

export const EventServices = { createEvent };
