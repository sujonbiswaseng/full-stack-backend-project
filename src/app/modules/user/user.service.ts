import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { UserService } from "./user.controller";
import status from "http-status";

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
    OwnProfileDelete
  }