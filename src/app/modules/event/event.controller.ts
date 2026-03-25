import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { EventServices } from "./event.service";

const createEvent = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await EventServices.createEvent(user, req.body);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Event created successfully",
    data: result,
  });
});

export const EventController={createEvent}