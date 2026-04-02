import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { invitationsServices } from "./invitations.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import paginationSortingHelper from "../../helpers/paginationHelping";

const CreateInvitation = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await invitationsServices.createInvitationService(user.userId,req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "invitations created successfully",
    data: result,
  });
});
const getInvitationsService = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);
  const result = await invitationsServices.getInvitationsService(
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
    const result = await invitationsServices.updateInvitationService(id as string, req.body);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Invitation updated", data: result });
  })

  

export const InvitationController={
CreateInvitation,
getInvitationsService,
GetSingleInvitationController,
deleteInvitation,
updateInvitation
}
