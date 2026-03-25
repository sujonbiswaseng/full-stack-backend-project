import { Router } from "express"
import { validateRequest } from "../../middleware/validateRequest"

import { Role } from "../../../generated/prisma/enums"
import auth from "../../middleware/Auth"
import { createInvitationSchema, updateInvitationSchema } from "./invitations.validation"
import { InvitationController } from "./invitations.controller"

const router=Router()
router.post("/event/:id",auth([Role.ADMIN,Role.USER]),validateRequest(createInvitationSchema),InvitationController.CreateInvitation)
router.get("/", InvitationController.GetAllInvitationsController);
router.get("/user/:id", InvitationController.GetUserInvitationsController);
router.get("/:id", InvitationController.GetSingleInvitationController);
router.put("/:id",auth([Role.ADMIN,Role.USER]),validateRequest(updateInvitationSchema), InvitationController.updateInvitation);
router.delete("/:id",auth([Role.ADMIN,Role.USER]),InvitationController.deleteInvitation);
export const InvitationsRouters=router
