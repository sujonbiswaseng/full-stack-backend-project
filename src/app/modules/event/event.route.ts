import { Router } from "express"
import { validateRequest } from "../../middleware/validateRequest"

import { Role } from "../../../generated/prisma/enums"
import auth from "../../middleware/Auth"
import { EventController } from "./event.controller"
import { CreateEventSchema, UpdateEventSchema } from "./event.validation"

const router=Router()
router.post("/",auth([Role.ADMIN,Role.USER]),validateRequest(CreateEventSchema), EventController.createEvent)
router.get("/", EventController.getAllEvents);
router.get("/:id", EventController.getSingleEvent);
router.put("/:id",auth([Role.ADMIN,Role.USER]),validateRequest(UpdateEventSchema), EventController.updateEvent);
router.delete("/:id",auth([Role.ADMIN,Role.USER]), EventController.DeletedEvent);
export const EventRouters=router
