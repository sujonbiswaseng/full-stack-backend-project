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

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const events = await EventServices.getAllEvents();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "All events fetched successfully",
    data: events,
  });
});

const getSingleEvent = catchAsync(async (req: Request, res: Response) => {
  const eventId = req.params.id;

  const event = await EventServices.getSingleEvent(eventId as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "single Event fetched successfully",
    data: event,
  });
});

 const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const eventId = req.params.id;

  const updatedEvent = await EventServices.updateEvent(eventId as string, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Event updated successfully",
    data: updatedEvent,
  });
});

 const DeletedEvent = catchAsync(async (req: Request, res: Response) => {
  const eventId = req.params.id;
  const deletedEvent = await EventServices.DeleteEvent(req.user,eventId as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Event deleted successfully",
  });
});

export const EventController={createEvent,getAllEvents,getSingleEvent,updateEvent,DeletedEvent}