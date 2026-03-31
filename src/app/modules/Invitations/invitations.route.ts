import { Router } from "express"
import { validateRequest } from "../../middleware/validateRequest"

import { Role } from "../../../generated/prisma/enums"
import auth from "../../middleware/Auth"
import { createInvitationSchema, updateInvitationSchema } from "./invitations.validation"
import { InvitationController } from "./invitations.controller"

const router=Router()
router.post("/invitation",auth([Role.ADMIN,Role.USER]),InvitationController.CreateInvitation)
router.get("/invitations", InvitationController.GetAllInvitationsController);
router.get("/invitation/user",auth([Role.ADMIN,Role.USER]), InvitationController.GetUserInvitationsController);
router.get("/invitation/:id", InvitationController.GetSingleInvitationController);
router.put("/invitation/:id",auth([Role.ADMIN,Role.USER]),validateRequest(updateInvitationSchema), InvitationController.updateInvitation);
router.delete("/invitation/:id",auth([Role.ADMIN,Role.USER]),InvitationController.deleteInvitation);
export const InvitationsRouters=router
