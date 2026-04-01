import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { ParticipantService } from "./participants.service";
import status from "http-status";
import { sendResponse } from "../../shared/sendResponse";
import paginationSortingHelper from "../../helpers/paginationHelping";

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
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)
    const participants = await ParticipantService.getAllParticipantsService(req.user.userId,page as number,limit as number,skip as number,sortBy as string,sortOrder as string,req.query);
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
  const participant = await ParticipantService.UpdateParticipantService(id as string, req.body,req.user.userId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Participant updated successfully",
    data: participant,
  });
});

const getOwnPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await ParticipantService.getOwnPaymentParticipantService(req.params.id as string,userId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Fetched own payment participants successfully",
    data: result,
  });
});


const deleteParticipant = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const participant = await ParticipantService.deleteParticipantService(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Participant deleted successfully",
    data: participant,
  });
});


const ParticipantCreateWithPayLater = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user;
    const id=req.params.id
    const appointment = await ParticipantService.createParticipantPayLater(user.userId,id as string,payload);
    sendResponse(res, {
        success: true,  
        httpStatusCode: status.CREATED,
        message: 'participant create with pay later successfully',
        data: appointment
    });
});


const initiatePayment = catchAsync(async (req: Request, res: Response) => {
    const eventId = req.params.id;
    const user = req.user;
    const paymentInfo = await ParticipantService.initiatePayment(eventId as string, user);

    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Payment initiated successfully',
        data: paymentInfo
    });
});
export const ParticipantControllers={createParticipantController,getAllParticipants,getSingleParticipant,updateParticipant,deleteParticipant,ParticipantCreateWithPayLater,initiatePayment,getOwnPayment}