import { Router } from "express"
import { validateRequest } from "../../middleware/validateRequest"

import { Role } from "../../../generated/prisma/enums"
import auth from "../../middleware/Auth"
import { EventController } from "./event.controller"
import { CreateEventSchema, UpdateEventSchema } from "./event.validation"
import { multerUpload } from "../../config/multer.config"
import { role } from "better-auth/plugins"

const router=Router()
router.post(
  "/event",
  auth([Role.ADMIN, Role.USER, Role.MANAGER]), 
  multerUpload.array("files"),
  validateRequest(CreateEventSchema),
  EventController.createEvent
)

router.get("/event/isfeatured", EventController.IsFeautured);
router.get("/events", EventController.getAllEvents);
router.get("/my-events",auth([Role.USER,Role.ADMIN,Role.MANAGER]), EventController.getEventsByRoleController);
router.get("/events/paidandfree", EventController.getPaidAndFreeEvent);
router.get("/event/:id", EventController.getSingleEvent);
router.put("/event/:id",auth([Role.ADMIN,Role.USER]),validateRequest(UpdateEventSchema), EventController.updateEvent);
router.delete("/event/:id",auth([Role.ADMIN,Role.USER,Role.MANAGER]), EventController.DeletedEvent);
export const EventRouters=router
