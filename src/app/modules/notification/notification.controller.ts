import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { getUserNotificationsService } from "./notification.service";

const getUserNotificationsController = catchAsync(async (req: Request, res: Response) => {
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