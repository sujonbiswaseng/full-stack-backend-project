// route for Participants module
import express from "express";
import { ParticipantControllers } from "./participants.controller";
import auth from "../../middleware/Auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/event/:id",auth([Role.ADMIN,Role.USER]), ParticipantControllers.createParticipantController);
router.get("/", ParticipantControllers.getAllParticipants);
router.get("/:id", ParticipantControllers.getSingleParticipant);
router.put("/:id", ParticipantControllers.updateParticipant);
export const ParticipantRoutes=router;