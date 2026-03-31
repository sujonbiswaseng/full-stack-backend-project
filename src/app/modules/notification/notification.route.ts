import express from "express";
import { NotificationController } from "./notification.controller";
import auth from "../../middleware/Auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.get("/notifications",auth([Role.USER]), NotificationController.getUserNotificationsController);

export const NotificationRoutes=router;