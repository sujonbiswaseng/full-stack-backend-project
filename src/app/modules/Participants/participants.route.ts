// route for Participants module
import express from "express";
import { ParticipantControllers } from "./participants.controller";
import auth from "../../middleware/Auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();
router.get("/participant/event/:id/own-payment", auth([Role.USER]), ParticipantControllers.getOwnPayment);

router.post("/participant/event/:id",auth([Role.ADMIN,Role.USER]), ParticipantControllers.createParticipantController);
router.get("/participants",auth([Role.ADMIN,Role.USER]), ParticipantControllers.getAllParticipants);
router.get("/participant/:id", ParticipantControllers.getSingleParticipant);
router.put("/participant/:id",auth([Role.ADMIN,Role.USER]),ParticipantControllers.updateParticipant);
router.delete("/participant/:id",auth([Role.ADMIN]),ParticipantControllers.deleteParticipant);
router.post("/participant-with-pay-later", auth([Role.USER]), ParticipantControllers.ParticipantCreateWithPayLater);
router.post("/initiate-payment/:id", auth([Role.USER]), ParticipantControllers.initiatePayment);
export const ParticipantRoutes=router;