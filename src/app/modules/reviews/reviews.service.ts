import AppError from "../../errorHelper/AppError";
import { prisma } from "../../lib/prisma";
import { ICreatereviewData, IUpdatereviewData } from "./reviews.interface";

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

const deleteReview = async (reviewid: string) => {
    const review = await prisma.review.findUnique({
        where: {
            id: reviewid,
        },
        select: {
            id: true
        }
    })
    if (!review) {
        throw new AppError(404, "review not found")
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


export const ReviewsServices={
    CreateReviews,
    updateReview,
    deleteReview,
    getAllreviews
}