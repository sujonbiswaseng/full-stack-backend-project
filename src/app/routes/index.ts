import { Router } from "express";
import { AuthRouters } from "../modules/auth/auth.route";
import { EventRouters } from "../modules/event/event.route";
import { InvitationsRouters } from "../modules/Invitations/invitations.route";
import { ParticipantRoutes } from "../modules/Participants/participants.route";
import { ReviewsRouters } from "../modules/reviews/reviews.route";
import { StatsRoutes } from "../modules/stats/stats.route";

const router = Router()
router.use("/v1/auth", AuthRouters);
// event
router.use("/v1", EventRouters);

// invitations
router.use("/v1", InvitationsRouters);

// participate
router.use("/v1", ParticipantRoutes);

// reviews
router.use("/v1", ReviewsRouters);
// reviews
router.use("/v1", StatsRoutes);
export const IndexRouter=router