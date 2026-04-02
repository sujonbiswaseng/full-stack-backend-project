import { Request, Response } from "express";
import AppError from "../../errorHelper/AppError";
import { prisma } from "../../lib/prisma";
import { catchAsync } from "../../shared/catchAsync";
import { UserService } from "./user.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import paginationSortingHelper from "../../helpers/paginationHelping";

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


const GetAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { emailVerified } = req.query;
  const isemailVerified = emailVerified
    ? req.query.emailVerified === "true"
      ? true
      : req.query.emailVerified === "false"
        ? false
        : undefined
    : undefined;
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
    req.query,
  );
  const result = await UserService.GetAllUsers(req.query,page, limit, skip, sortBy, sortOrder,isemailVerified);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "retrieve all users has been successfully",
    data: result,
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

const UpdateUser = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "you are unauthorized" });
    }
    const result = await UserService.UpdateUser(
      req.params.id as string,
      req.body,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: `user change successfully`,
      data: result,
    });
  },
);

const DeleteUserProfile = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "you are unauthorized" });
    }
    const result = await UserService.DeleteUserProfile(req.params.id as string);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "user account delete successfully",
      data: result,
    });
  },
);

const GetSingleUser = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.GetSingleUser(req.params.id as string);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Single user fetched successfully",
      data: result,
    });
  },
);


  export const UserController={
    UpdateUserProfile,
    OwnProfileDelete,
    GetAllUsers,
    UpdateUser,
    GetSingleUser,
    DeleteUserProfile
  }