// controller for reviews module

import { Request, Response } from "express"
import { catchAsync } from "../../shared/catchAsync"
import { sendResponse } from "../../shared/sendResponse"
import { ReviewsServices } from "./reviews.service"
import status from "http-status"

const CreateReviews =catchAsync(async (req: Request, res: Response) => {
         const user = req.user
        if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const result=await ReviewsServices.CreateReviews(user.userId,req.params.id as string,req.body)
        sendResponse(res,{
            httpStatusCode:status.CREATED,
            success:true,
            message:'your review has been created successfully',
            data:result
        })
})

const updateReview = catchAsync(async (req: Request, res: Response) => {
      const user = req.user;
       if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const { reviewid } = req.params;
        const result = await ReviewsServices.updateReview(reviewid as string, req.body, user.userId as string)
            sendResponse(res,{
                httpStatusCode:status.OK,
                success:true,
                message:"review update successfully",
                data:result
            })
} )

const deleteReview = catchAsync(async (req: Request, res: Response) => {
      const user = req.user;
       if (!user) {
           return res.status(401).json({ success: false, message: "you are unauthorized" })
        }
        const { reviewid } = req.params;
        const result = await ReviewsServices.deleteReview(reviewid as string)
            sendResponse(res,{
                httpStatusCode:status.OK,
                success:true,
                message:"review delete successfully",
                data:result
            })
}
)

const getAllreviews=catchAsync(async (req: Request, res: Response) => {
    const result = await ReviewsServices.getAllreviews()
    sendResponse(res,{
        httpStatusCode:status.OK,
        success:true,
        message:"retrieve all reviews successfully",
        data:result
    })
}
)
const getReviewsByRole = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    // assuming user.role and user.userId are available on req.user
    const result = await ReviewsServices.getReviewsByRole(user.role, user.userId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "retrieve reviews by role successfully",
        data: result
    });
});



const moderateReview = catchAsync(async (req: Request, res: Response) => {
        const { reviewid } = req.params;
        const result = await ReviewsServices.moderateReview(reviewid as string, req.body)
            sendResponse(res,{
                httpStatusCode:status.OK,
                success:true,
                message:"review moderate successfully",
                data:result
                })
})

export const ReviewsControllers={
    CreateReviews,
    updateReview,
    deleteReview,
    getAllreviews,
    moderateReview,
    getReviewsByRole
}