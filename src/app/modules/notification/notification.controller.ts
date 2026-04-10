import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { getUserNotificationsService } from "./notification.service";
import AppError from "../../errorHelper/AppError";

const getUserNotificationsController = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized access. Please login first.");
  }

  const result = await getUserNotificationsService(req.user.userId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: `Notifications for user ${req.user.userId} fetched successfully`,
    data: result,
  });
});

export const NotificationController = {
  getUserNotificationsController,
};