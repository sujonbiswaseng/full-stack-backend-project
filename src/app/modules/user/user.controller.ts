import { Request, Response } from "express";
import AppError from "../../errorHelper/AppError";
import { prisma } from "../../lib/prisma";
import { catchAsync } from "../../shared/catchAsync";
import { UserService } from "./user.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const UpdateUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "you are unauthorized" });
  }

  const result = await UserService.UpdateUserProfile(req.body, user.userId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User profile updated successfully.",
    data: result
  });
});


const OwnProfileDelete = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "you are unauthorized" });
  }
  const result = await UserService.OwnProfileDelete(user.userId as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "user own account delete successfully",
    data:result
  });
});

  export const UserController={
    UpdateUserProfile,
    OwnProfileDelete
  }