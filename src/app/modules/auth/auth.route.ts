import { Router } from "express"
import { AuthController } from "./auth.controller"
import { validateRequest } from "../../middleware/validateRequest"
import { createUserSchema } from "./auth.validation"
import { Role } from "../../../generated/prisma/enums"
import auth from "../../middleware/Auth"

const router=Router()
router.post("/register",validateRequest(createUserSchema), AuthController.UserRegister)
router.post("/login", AuthController.loginUser)
router.get("/me",auth([Role.ADMIN, Role.USER]), AuthController.getMe)

router.post("/change-password", auth([Role.ADMIN, Role.USER]), AuthController.changePassword)
export const AuthRouters=router
