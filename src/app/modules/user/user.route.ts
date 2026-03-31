import { Router } from "express"
import { Role } from "../../../generated/prisma/enums"
import { UserController } from "./user.service"
import auth from "../../middleware/Auth"

const router=Router()
router.delete("/profile/own",auth([Role.USER]),UserController.OwnProfileDelete)

export default router