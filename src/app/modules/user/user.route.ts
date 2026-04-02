import { Router } from "express"
import { Role } from "../../../generated/prisma/enums"
import auth from "../../middleware/Auth";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { UpdateuserProfileData } from "./user.validation";

const router=Router()
router.get("/admin/users",auth([Role.ADMIN]),UserController.GetAllUsers)
router.delete("/profile/own",auth([Role.USER]),UserController.OwnProfileDelete)



router.put(
  "/profile/update",
  auth([Role.USER, Role.ADMIN]),
  validateRequest(UpdateuserProfileData),
  UserController.UpdateUserProfile
);

router.delete("/profile/own/delete",auth([Role.USER,Role.ADMIN]),UserController.OwnProfileDelete)


export const UsersRoutes = router;
