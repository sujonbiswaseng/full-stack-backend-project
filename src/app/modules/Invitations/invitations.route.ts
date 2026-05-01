import { Router } from "express"
import { validateRequest } from "../../middleware/validateRequest"

import { Role } from "../../../generated/prisma/enums"
import auth from "../../middleware/Auth"
import { createInvitationSchema, updateInvitationSchema } from "./invitations.validation"
import { InvitationController } from "./invitations.controller"

const router=Router()
router.post("/invitation",auth([Role.ADMIN,Role.USER,Role.MANAGER]),InvitationController.CreateInvitation)
router.get("/invitation/user",auth([Role.ADMIN,Role.USER,Role.MANAGER]), InvitationController.getInvitationsService);
router.get("/invitation/:id", InvitationController.GetSingleInvitationController);
router.put("/invitation/:id",auth([Role.ADMIN,Role.USER,Role.MANAGER]),validateRequest(updateInvitationSchema), InvitationController.updateInvitation);
router.delete("/invitation/:id",auth([Role.ADMIN,Role.USER,Role.MANAGER]),InvitationController.deleteInvitation);
export const InvitationsRouters=router
