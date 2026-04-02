// route for Participants module
import express from "express";
import auth from "../../middleware/Auth";
import { Role } from "../../../generated/prisma/enums";
import { PaymentController } from "./payment.controller";

const router = express.Router();
router.get("/payments", auth([Role.ADMIN]), PaymentController.getAllPayment);

export const PaymentRoutes=router