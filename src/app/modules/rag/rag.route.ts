import { Router } from "express";
import { RagController } from "./rag.controller";
import auth from "../../middleware/Auth";
import { Role } from "../../../generated/prisma/enums";
import { attachViewer } from "../../lib/attracviewer";

const router=Router()
router.get("/stats",RagController.getStats)
router.post("/ingest-event",RagController.Ingestevents)

// query rag
router.post("/query", RagController.queryRag);
router.post("/suggest", RagController.querySuggession);
router.post(
    "/recommendations",attachViewer,
RagController.personalizedRecommendation);
router.post(
  "/trending-items",
  RagController.trendingItems
);

export const Ragrouter=router