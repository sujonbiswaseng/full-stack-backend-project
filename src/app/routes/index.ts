import { Router } from "express";
import { AuthRouters } from "../modules/auth/auth.route";
import { EventRouters } from "../modules/event/event.route";
import { InvitationsRouters } from "../modules/Invitations/invitations.route";
import { ParticipantRoutes } from "../modules/Participants/participants.route";
import { ReviewsRouters } from "../modules/reviews/reviews.route";
import { StatsRoutes } from "../modules/stats/stats.route";
import { UsersRoutes } from "../modules/user/user.route";
import { NotificationRoutes } from "../modules/notification/notification.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { BlogRouters } from "../modules/blog/blog.route";
import { HighlightRouters } from "../modules/highlight/highlight.route";
import { Ragrouter } from "../modules/rag/rag.route";
import { NewsletterRouters } from "../modules/newsletter/newsletter.route";

const router = Router()
router.use('/v1/rag',Ragrouter)
router.use("/v1", BlogRouters);
router.use("/v1", HighlightRouters);

router.use("/v1", NewsletterRouters);

router.use("/v1/auth", AuthRouters);

router.use("/v1", UsersRoutes);
// event
router.use("/v1", EventRouters);

// invitations
router.use("/v1", InvitationsRouters);

// participate
router.use("/v1", ParticipantRoutes);

// reviews
router.use("/v1", ReviewsRouters);
router.use("/v1", StatsRoutes);

router.use("/v1", NotificationRoutes);
router.use("/v1", PaymentRoutes);


export const IndexRouter=router