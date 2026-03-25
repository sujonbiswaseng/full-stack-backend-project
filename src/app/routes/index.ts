import { Router } from "express";
import { AuthRouters } from "../modules/auth/auth.route";
import { EventRouters } from "../modules/event/event.route";

const router = Router()
router.use("/auth", AuthRouters);
// event
router.use("/v1/event", EventRouters);
export const IndexRouter=router