import { Router } from "express"
import { validateRequest } from "../../middleware/validateRequest"

import { Role } from "../../../generated/prisma/enums"
import auth from "../../middleware/Auth"
import { EventController } from "./event.controller"
import { CreateEventSchema } from "./event.validation"

const router=Router()
router.post("/event",auth([Role.ADMIN,Role.USER]),validateRequest(CreateEventSchema), EventController.createEvent)
export const EventRouters=router
