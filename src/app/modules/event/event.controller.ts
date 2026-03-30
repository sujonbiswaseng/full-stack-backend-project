import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { EventServices } from "./event.service";
import paginationSortingHelper from "../../helpers/paginationHelping";

const createEvent = catchAsync(async (req: Request, res: Response) => {
        const payload = {
            ...req.body,
            image:req.file?.path || req.body.image
        };
  const user = req.user;
  const result = await EventServices.createEvent(user, payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Event created successfully",
    data: result,
  });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)
  const events = await EventServices.getAllEvents(req.query,page, limit, skip, sortBy, sortOrder);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "All events fetched successfully",
    data: events,
  });
});


 const getEventsByRoleController = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);

  const userId = req.user.userId;
  const role = req.user.role;
  const search=req.query?.search
  const events = await EventServices.getEventsByRole(
    req.query,
    userId,
    role,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    search as string
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Events fetched based on role successfully",
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

const getPaidAndFreeEvent = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)
  const events = await EventServices.GetPaidAndFreeEvent(page, limit, skip, sortBy, sortOrder);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Paid and Free events fetched successfully",
    data: events,
  });
});

 const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const eventId = req.params.id;
  const user=req.user

  const updatedEvent = await EventServices.updateEvent(eventId as string, req.body ,user.email);

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

export const EventController={createEvent,getAllEvents,getSingleEvent,updateEvent,DeletedEvent,getPaidAndFreeEvent,getEventsByRoleController}