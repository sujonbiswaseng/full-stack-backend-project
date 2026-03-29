import status from "http-status";
import AppError from "../../errorHelper/AppError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import {
  ICreateEvent,
  IEventQuery,
  IUpdateEventInput,
} from "./event.interface";
import { EventWhereInput } from "../../../generated/prisma/models";
import { EventType } from "../../../generated/prisma/enums";

const createEvent = async (user: IRequestUser, payload: ICreateEvent) => {
  const {
    description,
    date,
    time,
    title,
    visibility,
    priceType,
    venue,
    fee,
    categories,
    image,
  } = payload;
  const event = await prisma.event.create({
    data: {
      title,
      description,
      date,
      time,
      priceType,
      categories,
      venue,
      image,
      visibility,
      fee,
      organizerId: user.userId,
    },
  });

  return event;
};

const getAllEvents = async (
  data: IEventQuery,
  page?: number,
  limit?: number | undefined,
  skip?: number,
  sortBy?: string | undefined,
  sortOrder?: string | undefined,
) => {
  const statuses = [
    "DRAFT",
    "UPCOMING",
    "ONGOING",
    "COMPLETED",
    "CANCELLED",
  ] as const;
  const andConditions: EventWhereInput[] | EventWhereInput = [];

  if (data) {
    const orConditions: any[] = [];
    if (data.title) {
      orConditions.push({
        title: {
          contains: data.title,
          mode: "insensitive",
        },
      });
    }

    if (data.search) {
      orConditions.push(
        {
          title: {
            contains: data.search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: data.search,
            mode: "insensitive",
          },
        },
        {
          categories: {
            contains: data.search,
            mode: "insensitive",
          },
        },
        {
          venue: {
            contains: data.search,
            mode: "insensitive",
          },
        }
      );
    }

    if (data.description) {
      orConditions.push({
        description: {
          contains: data.description,
          mode: "insensitive",
        },
      });
    }
    if (data.categories) {
      orConditions.push({
        categories: {
          contains: data.categories,
          mode: "insensitive",
        },
      });
    }
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }


  if (data.fee) {
    andConditions.push({
      fee: {
        gte: 1,
        lte: Number(data.fee),
      },
    });
  }

  if (data.visibility) {
    andConditions.push({
      visibility: data.visibility as EventType,
    });
  }

  if (data.priceType) {
    andConditions.push({
      priceType: data.priceType,
    });
  }
  if (data.is_featured) {
    andConditions.push({
      is_featured: data.is_featured,
    });
  }

  if (data.status) {
    andConditions.push({
      status: data.status,
    });
  }

  if (data.date) {
    andConditions.push({
      date: data.date,
    });
  }

  const result: any = {};
  for (const status of statuses) {
    const events = await prisma.event.findMany({
      take: limit,
      skip,
      where: { status, AND: andConditions },
      include: {
        reviews: {
          where: { rating: { gt: 0 } },
        },
        organizer:{
          select:{
            name:true,
            email:true,
            phone:true,
            image:true
          }
        }
      },
      orderBy: {
        [sortBy!]:sortOrder
      },
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
  const total = await prisma.event.count({ where: { AND: andConditions } });

  return {
     data:result,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / limit!) || 1,
    },
  };
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


const GetPaidAndFreeEvent = async () => {
  const PublicPaidEventRaw = await prisma.event.findMany({
    where: { 
      payments: {
        some: { status: "PAID" }
      },
      visibility: 'PUBLIC'
    },
    include: {
      reviews: {
        where: {
          rating: {
            gt: 0,
          }
        }
      }
    }
  });

  const PublicPaidEvent = PublicPaidEventRaw.map(event => {
    const totalReviews = event.reviews.length || 0;
    const avgRating = totalReviews > 0 
      ? event.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;
    const { reviews, ...eventData } = event;
    return { ...eventData, avgRating, totalReviews };
  });

  const PublicFreeEventRaw = await prisma.event.findMany({
    where: {
      payments: {
        some: {
          status: "FREE"
        }
      },
      visibility: 'PUBLIC'
    },
    include: {
      reviews: {
        where: {
          rating: {
            gt: 0,
          }
        }
      }
    }
  });

  const PublicFreeEvent = PublicFreeEventRaw.map(event => {
    const totalReviews = event.reviews.length || 0;
    const avgRating = totalReviews > 0 
      ? event.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;
    const { reviews, ...eventData } = event;
    return { ...eventData, avgRating, totalReviews };
  });

  const PrivateFreeEventRaw = await prisma.event.findMany({
    where: {
      payments: {
        some: {
          status: "FREE"
        }
      },
      visibility: 'PRIVATE'
    },
    include: {
      reviews: {
        where: {
          rating: {
            gt: 0,
          }
        }
      }
    }
  });

  const PrivateFreeEvent = PrivateFreeEventRaw.map(event => {
    const totalReviews = event.reviews.length || 0;
    const avgRating = totalReviews > 0 
      ? event.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;
    const { reviews, ...eventData } = event;
    return { ...eventData, avgRating, totalReviews };
  });

  const PrivatePaidEventRaw = await prisma.event.findMany({
    where: {
      payments: {
        some: {
          status: "PAID"
        }
      },
      visibility: 'PRIVATE'
    },
    include: {
      reviews: {
        where: {
          rating: {
            gt: 0,
          }
        }
      }
    }
  });

  const PrivatePaidEvent = PrivatePaidEventRaw.map(event => {
    const totalReviews = event.reviews.length || 0;
    const avgRating = totalReviews > 0 
      ? event.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;
    const { reviews, ...eventData } = event;
    return { ...eventData, avgRating, totalReviews };
  });


  return {
    PrivateFreeEvent,
    PrivatePaidEvent,
    PublicFreeEvent,
    PublicPaidEvent
  };
  
  


  


  
};



const updateEvent = async (eventId: string, payload: IUpdateEventInput,email:string) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });
  const userExist = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!userExist) {
    throw new AppError(404, "User not found");
  }
  
  if (payload.is_featured && userExist.role!=="ADMIN") {
    throw new AppError(403, "You are not authorized to feature this event");
  }

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
      visibility: payload.visibility as EventType,
      venue: payload.venue,
      status: payload.status,
      priceType: payload.priceType,
      categories: payload.categories,
      is_featured:payload.is_featured
      
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
  GetPaidAndFreeEvent
};
