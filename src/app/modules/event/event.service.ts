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
import { parseDateForPrisma } from "../../utils/parseDate";

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
  if(!image){
    throw new AppError(status.BAD_REQUEST, "Image is required to create an event.");
  }
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
  query?: Record<string, any>,
  page?: number,
  limit?: number | undefined,
  skip?: number,
  sortBy?: string | undefined,
  sortOrder?: string | undefined,
  is_featureddata?:any,
  search?:any
) => {
  const statuses = [
    "DRAFT",
    "UPCOMING",
    "ONGOING",
    "COMPLETED",
    "CANCELLED",
  ] as const;
  const andConditions: EventWhereInput[] | EventWhereInput = [];

  if (query) {
    const orConditions: any[] = [];
    if (query.title) {
      orConditions.push({
        title: {
          contains: query.title,
          mode: "insensitive",
        },
      });
    }

    if (query.createdAt) {
      const dateRange = parseDateForPrisma(query.createdAt);
      andConditions.push({ createdAt: dateRange.gte });
    }
    if (query.date) {
      const dateRange = parseDateForPrisma(query.date);
      andConditions.push({date: dateRange});
    }

    if (search) {
      orConditions.push(
        {
          title: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          venue: {
            contains: query.search,
            mode: "insensitive",
          },
        }
      );
    }

    if (query.description) {
      orConditions.push({
        description: {
          contains: query.description,
          mode: "insensitive",
        },
      });
    }
    if (query.categories) {
      orConditions.push({
        categories: query.categories,
      });
    }
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }


  if (query?.fee) {
    andConditions.push({
      fee: {
        gte: 1,
        lte: Number(query.fee),
      },
    });
  }

  if (query?.visibility) {
    andConditions.push({
      visibility: query.visibility as EventType,
    });
  }

  if (query?.priceType) {
    andConditions.push({
      priceType: query.priceType,
    });
  }
  if (is_featureddata) {
    andConditions.push({
      is_featured: is_featureddata,
    });
  }


  if (query?.status) {
    andConditions.push({
      status: query.status,
    });
  }

  const result: any = {};
  for (const status of statuses) {
    const events = await prisma.event.findMany({
      take: limit,
      skip,
      where: { status, AND: andConditions,is_featured:is_featureddata},
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

 const getEventsByRole = async (
  data: IEventQuery,
  userId: string,
  role: string,
  page?: number,
  limit?: number,
  skip?: number,
  sortBy?: string,
  sortOrder?: string,
  search?:string
) => {
  const statuses = ["DRAFT", "UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"] as const;
  const andConditions: EventWhereInput[] = [];

  // ---------- Filters ----------
  if (search) {
    const orConditions: any[] = [];
      orConditions.push(
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { venue: { contains: search, mode: "insensitive" } }
      );
    if (orConditions.length > 0) andConditions.push({ OR: orConditions });
  }

  if (data.categories) {
    andConditions.push({ categories: data.categories });
  }
  if (data.createdAt) {
    const isoString = new Date(data.createdAt).toISOString();
    andConditions.push({ createdAt: isoString });
  }
  if (data.date) {
    const dateRange = parseDateForPrisma(data.date);
    andConditions.push({ date: {gte:dateRange.gte} });
  } if (data.createdAt) {
    const dateRange = parseDateForPrisma(data.createdAt);
    andConditions.push({ createdAt:dateRange });
  }
  if (data.fee) andConditions.push({ fee: { lte: Number(data.fee) } });
  if (data.visibility) andConditions.push({ visibility: data.visibility as EventType });
  if (data.priceType) andConditions.push({ priceType: data.priceType });
  if (data.is_featured !== undefined) {
    andConditions.push({
      is_featured: typeof data.is_featured === "string" ? data.is_featured === "true" : data.is_featured
    });
  }
  if (data.status) andConditions.push({ status: data.status });
  if (data.time) andConditions.push({ time: data.time });

  // ---------- Role Based Filter ----------
  if (role === "USER") {
    andConditions.push({ organizerId: userId });
  } 
  const result: any = {};
  const dateRange = parseDateForPrisma(data.createdAt as any);

  for (const status of statuses) {
    const events = await prisma.event.findMany({
      where: { status, AND: andConditions ,createdAt:{gte:dateRange.gte}},
      take: limit,
      skip,
      include: {
        reviews: { where: { rating: { gt: 0 } } },
        organizer: { select: { name: true, email: true, phone: true, image: true } },
      },
      orderBy: sortBy ? { [sortBy]: sortOrder } : { date: "desc" },
    });

    result[status] = events.map((event) => {
      const totalReviews = event.reviews.length;
      const avgRating = totalReviews > 0 ? event.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
      return { ...event, avgRating, totalReviews };
    });
  }

  const total = await prisma.event.count({ where: { AND: andConditions } });

  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / (limit || 1)),
    },
  };
};

const getSingleEvent = async (eventId: string) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      reviews: {
        where: { rating: { gt: 0 }, parentId: null },
        include: {
          replies: {
            include: {
              replies: {
                include: {
                  replies: true,
                  user: true,
                }
              },
              user: true,
            }
          },
          user: true,
        },
      },
      organizer:true
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


const calculateReviewStats = (event: any) => {
  const totalReviews = event.reviews.length;
  const avgRating = totalReviews
    ? event.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews
    : 0;

  const { reviews, ...eventData } = event;
  return { ...eventData, avgRating, totalReviews };
};

const GetPaidAndFreeEvent = async (
  page?: number,
  limit?: number | undefined,
  skip?: number,
  sortBy?: string | undefined,
  sortOrder?: string | undefined,) => {


  const PublicPaidEventRaw = await prisma.event.findMany({
    take: limit,
    skip,
    where: {
      visibility: "PUBLIC",
      priceType:"PAID",
    },
    include: {
      reviews: {
        where: {
          rating: { gt: 0 }
        }
      }
    },
    orderBy: {
      [sortBy!]:sortOrder
    },
  });

  const PublicPaidEvent = PublicPaidEventRaw.map(calculateReviewStats);

  const PublicFreeEventRaw = await prisma.event.findMany({
    where: {
      visibility: "PUBLIC",
      priceType:"FREE"
    },
    include: {
      reviews: {
        where: {
          rating: { gt: 0 }
        }
      }
    }
  });

  const PublicFreeEvent = PublicFreeEventRaw.map(calculateReviewStats);

  const PrivateFreeEventRaw = await prisma.event.findMany({
    where: {
      visibility: "PRIVATE",
      priceType:"FREE",
    },
    include: {
      reviews: {
        where: {
          rating: { gt: 0 }
        }
      }
    }
  });

  const PrivateFreeEvent = PrivateFreeEventRaw.map(calculateReviewStats);
  const PrivatePaidEventRaw = await prisma.event.findMany({
    where: {
      visibility: "PRIVATE",
      priceType:"PAID",
    },
    include: {
      reviews: {
        where: {
          rating: { gt: 0 }
        }
      }
    }
  });

  const PrivatePaidEvent = PrivatePaidEventRaw.map(calculateReviewStats);

  return {
    PublicPaidEvent,
    PublicFreeEvent,
    PrivateFreeEvent,
    PrivatePaidEvent,
    pagination: {
      page,
      limit
    },
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

const IsFeautured = async () => {
  const featuredEvents = await prisma.event.findMany({
    where: {
      is_featured: true,
    },
    orderBy: {
      date: 'asc',
    },
  });

  return featuredEvents;
};


export const EventServices = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  DeleteEvent,
  GetPaidAndFreeEvent,
  getEventsByRole,
  IsFeautured
};
