import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { invitationsServices } from "./invitations.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const CreateInvitation = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const id=req.params.id
  const result = await invitationsServices.createInvitationService(id as string,user.userId,req.body);

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
  const { id } = req.params;
  const result = await invitationsServices.getUserInvitationsService(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: `Invitations for user ${id} fetched successfully`,
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

  const getUserInvitationsService = async (userId: string) => {
    return prisma.invitation.findMany({
      where: { inviteeId: userId },
      include: {
        event: true,
        inviter: { select: { id: true, name: true, email: true, image: true } }
      },
      orderBy: { createdAt: "desc" },
    });
  };

export const InvitationController={
CreateInvitation,
GetAllInvitationsController,
GetUserInvitationsController,
GetSingleInvitationController,
deleteInvitation,
updateInvitation
}
