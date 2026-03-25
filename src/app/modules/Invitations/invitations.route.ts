import { Router } from "express"
import { validateRequest } from "../../middleware/validateRequest"

import { Role } from "../../../generated/prisma/enums"
import auth from "../../middleware/Auth"
import { createInvitationSchema } from "./invitations.validation"
import { InvitationController } from "./invitations.controller"

const router=Router()
router.post("/event/:id",auth([Role.ADMIN,Role.USER]),validateRequest(createInvitationSchema),InvitationController.CreateInvitation)
router.get("/", InvitationController.GetAllInvitationsController);
export const InvitationsRouters=router
