import { ReviewStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelper/AppError";
import { IOptionsResult } from "../../helpers/paginationHelping";
import { prisma } from "../../lib/prisma";
import { ICreatereviewData, IReviewQueryParams, IUpdatereviewData } from "./reviews.interface";

// service for reviews module
const CreateReviews = async (userId: string, eventId: string, data: ICreatereviewData) => {
    const existingmeal = await prisma.event.findUnique({
        where: {
            id: eventId
            }
    })
    if(!existingmeal){
        throw new AppError(404, "meal not found for this id")
    }
    if (data.rating >= 6) {
      throw new AppError(400, "rating must be between 1 and 5")
    }

    const result = await prisma.review.create({
        data: {
            userId: userId,
            eventId: eventId,
            ...data

        }
    })

    return result

}


const updateReview = async (reviewId: string, data: IUpdatereviewData, userid: string) => {
  
    const review = await prisma.review.findFirst({
        where: {
            id: reviewId,
            userId: userid
        },
        select: {
            id: true
        }
    })
    if (!review) {
        throw new AppError(404,"your review not found,please update your own review")
    }

    const result = await prisma.review.update({
        where: {
            id: reviewId,
            userId: userid
        },
        data: {
            ...data
        }
    })
    return {
        success: true,
        message:`your review update successfully`,
        result
    }
}

const deleteReview = async (reviewid: string,userid:string) => {

    const review = await prisma.review.findUnique({
        where: {
            id: reviewid,
        },
        select: {
            id: true,
            userId: true
        }
    });
    if (!review) {
        throw new AppError(404, "review not found");
    }
    if (userid !== review.userId && userid !== "admin") {
        throw new AppError(403, "You are not authorized to delete this review");
    }


    const result = await prisma.review.delete({
        where: {
            id: review.id
        }
    })

    return result
}


const getAllreviews = async () => {
    const result = await prisma.review.findMany({
        include: {
            user: true,
            event: true,
            replies:true
        }
    })

    return result
}



const getReviewsByRole = async (
  role: string, 
  userId: string, 
  page = 1, 
  limit = 10, 
  skip = 0, 
  data:IReviewQueryParams,
  sortBy = "createdAt", 
  sortOrder: "asc" | "desc" = "desc",

) => {
  const andConditions: any[] = [];

    if (data.parentId !== undefined) {
      andConditions.push({
        parentId: data.parentId,
      });
    }
    if (data.status) {
      andConditions.push({
        status: data.status as ReviewStatus | undefined
      });
    }
    if (typeof data.rating === "number") {
      andConditions.push({
        rating: Number(data.rating)
      });
    }
  if (role === "USER") {
    andConditions.push({
      event: {
        organizerId: userId
      }
    });
  } else if (role !== "ADMIN") {
    throw new AppError(403, "You are not authorized to view these reviews");
  }

  // Prepare findMany arguments
  const whereClause = andConditions.length > 0 ? { AND: andConditions } : undefined;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: whereClause,
      take: limit,
      skip: skip,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            venue: true,
            ...(role === "ADMIN" && { organizerId: true }),
          },
        },
        replies: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.review.count({
      where: whereClause,
    }),
  ]);
  return {
    data: reviews,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / (limit)) || 1,
    },
  };
};





const moderateReview = async (id: string, data: { status: ReviewStatus }) => {
    const {status}=data
    console.log(status,'s')

    const reviewData = await prisma.review.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            status: true
        }
    });
    if (!reviewData) {
        throw new AppError(404,'review data not found by id')
    }

    if (reviewData.status === data.status) {
        throw new AppError(409, `Your provided status (${data.status}) is already up to date.`)
    }

    const result = await prisma.review.update({
        where: {
            id
        },
        data:{
            status
        }
    })

    return result
}



export const ReviewsServices={
    CreateReviews,
    updateReview,
    deleteReview,
    getAllreviews,
    moderateReview,
    getReviewsByRole
}