import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { ParticipantService } from "./participants.service";
import status from "http-status";
import { sendResponse } from "../../shared/sendResponse";

const createParticipantController = catchAsync(async (req: Request, res: Response) => {
    const id=req.params.id
    const user=req.user
    const result = await ParticipantService.createParticipantService(user.userId,id as string,req.body);
    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Participant created successfully",
      data: result,
    });
});


const getAllParticipants= catchAsync(async (req: Request, res: Response) => {
    const participants = await ParticipantService.getAllParticipantsService();
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "All participants fetched",
      data: participants,
    });
  })

const getSingleParticipant= catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const participant = await ParticipantService.getSingleParticipantService(id as string);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "single Participant fetched successfully",
      data: participant,
    });
  })


  const updateParticipant = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const participant = await ParticipantService.UpdateParticipantService(id as string, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Participant updated successfully",
    data: participant,
  });
});

export const ParticipantControllers={createParticipantController,getAllParticipants,getSingleParticipant,updateParticipant}