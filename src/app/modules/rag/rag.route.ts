import { Router } from "express";
import { RagController } from "./rag.controller";
import auth from "../../middleware/Auth";
import { Role } from "../../../generated/prisma/enums";

const router=Router()
router.get("/stats",RagController.getStats)
router.post("/ingest-event",RagController.Ingestevents)

// query rag
router.post("/query", RagController.queryRag);
router.post("/suggest", RagController.querySuggession);
router.post(
    "/recommendations",auth([Role.ADMIN,Role.MANAGER,Role.USER]),
RagController.personalizedRecommendation);
export const Ragrouter=router