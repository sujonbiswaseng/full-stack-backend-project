import { Router } from "express"
import { Role } from "../../../generated/prisma/enums"
import auth from "../../middleware/Auth";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { UpdateUserCommonData, UpdateuserProfileData } from "./user.validation";

const router=Router()
router.get("/admin/users",auth([Role.ADMIN]),UserController.GetAllUsers)
router.delete("/profile/own",auth([Role.USER]),UserController.OwnProfileDelete)
router.get(
  "/profile/:id",
  UserController.GetSingleUser
);



router.put(
  "/profile/update",
  auth([Role.USER, Role.ADMIN]),
  validateRequest(UpdateuserProfileData),
  UserController.UpdateUserProfile
);

router.put("/admin/profile/:id",auth([Role.ADMIN]),validateRequest(UpdateUserCommonData),UserController.UpdateUser)

router.delete("/profile/own/delete",auth([Role.USER,Role.ADMIN]),UserController.OwnProfileDelete)

router.delete("/admin/profile/:id",auth([Role.ADMIN]),UserController.DeleteUserProfile)
export const UsersRoutes = router;
