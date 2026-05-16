import express from "express";
import { aiSearchController } from "./ai.controller";


const router = express.Router();

router.post("/suggest", aiSearchController.searchSuggestions);
// router.get("/recommend", aiSearchController.getRecommendations);
// router.get("/trending", aiSearchController.getTrending);

export const AiRouter=router;