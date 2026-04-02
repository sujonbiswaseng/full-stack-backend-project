import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { envVars } from "../../config/env";
import status from "http-status";
import { stripe } from "../../config/stripe.config";
import { PaymentService } from "./payment.service";
import { sendResponse } from "../../shared/sendResponse";
import paginationSortingHelper from "../../helpers/paginationHelping";
// controller for payment module
const handleStripeWebhookEvent = catchAsync(async (req : Request, res : Response) => {
    const signature = req.headers['stripe-signature'] as string
    const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET;
      if(!signature || !webhookSecret){
        console.error("Missing Stripe signature or webhook secret");
        return res.status(status.BAD_REQUEST).json({message : "Missing Stripe signature or webhook secret"})
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (error) {
        console.error("Error processing Stripe webhook:", error);
        return res.status(status.BAD_REQUEST).json({message : "Error processing Stripe webhook"})
    }

     try {
        const result = await PaymentService.handlerStripeWebhookEvent(event);

        sendResponse(res, {
            httpStatusCode : status.OK,
            success : true,
            message : "Stripe webhook event processed successfully",
            data : result
        })
    } catch (error) {
        console.error("Error handling Stripe webhook event:", error);
        sendResponse(res, {
            httpStatusCode : status.INTERNAL_SERVER_ERROR,
            success : false,
            message : "Error handling Stripe webhook event"
        })
    }
})


const getAllPayment= catchAsync(async (req: Request, res: Response) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)
      const payments = await PaymentService.getAllPaymentsService(req.user.userId,page as number,limit as number,skip as number,sortBy as string,sortOrder as string,req.query);
      sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "All payment fetched",
        data: payments,
      });
    })

const updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
    const { paymentId } = req.params;
    const { status: newStatus } = req.body;

    try {
        const result = await PaymentService.updatePaymentStatusWithParticipantCheck(paymentId as string,newStatus)
        return sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Payment status updated successfully",
            data: result
        });
    } catch (error) {
        console.error("Error updating payment status:", error);
        return sendResponse(res, {
            httpStatusCode: status.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Error updating payment status"
        });
    }
});

const deletePayment = catchAsync(async (req: Request, res: Response) => {
    const { paymentId } = req.params;

    try {
        const result = await PaymentService.deletePayment(paymentId as string);
        return sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Payment deleted successfully",
            data: result
        });
    } catch (error) {
        console.error("Error deleting payment:", error);
        return sendResponse(res, {
            httpStatusCode: status.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Error deleting payment"
        });
    }
});


export const PaymentController = {
    handleStripeWebhookEvent,
    getAllPayment,
    updatePaymentStatus,
    deletePayment
}