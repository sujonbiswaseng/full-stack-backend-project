import { Router } from "express";
import { AuthRouters } from "../modules/auth/auth.route";

const router = Router()
router.use("/auth", AuthRouters);
export const IndexRouter=router