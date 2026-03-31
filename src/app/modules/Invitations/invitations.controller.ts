import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { invitationsServices } from "./invitations.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import paginationSortingHelper from "../../helpers/paginationHelping";

const CreateInvitation = catchAsync(async (req: Request, res: Response) => {
  console.log(req.user,'user')
  const user = req.user;
  const result = await invitationsServices.createInvitationService(user.userId,req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "invitations created successfully",
    data: result,
  });
});

const GetAllInvitationsController = catchAsync(async (req: Request, res: Response) => {
  const result = await invitationsServices.getAllInvitationsService();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "All invitations fetched successfully",
    data: result,
  });
});

const GetUserInvitationsController = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);
  const result = await invitationsServices.getUserInvitationsService(
    req.user.userId as string,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    req.query
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: `Invitations for user ${req.user.userId} fetched successfully`,
    data: result,
  });
});


const GetSingleInvitationController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await invitationsServices.getSingleInvitationService(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "single Invitation fetched successfully",
    data: result,
  });
});


const deleteInvitation= catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await invitationsServices.deleteInvitationService(id as string);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Invitation deleted", data: result });
  })


  const updateInvitation= catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await invitationsServices.updateInvitationService(id as string, req.body,req.user.role);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Invitation updated", data: result });
  })

  

export const InvitationController={
CreateInvitation,
GetAllInvitationsController,
GetUserInvitationsController,
GetSingleInvitationController,
deleteInvitation,
updateInvitation
}
