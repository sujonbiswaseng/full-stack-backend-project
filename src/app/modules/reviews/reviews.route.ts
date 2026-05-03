// route for reviews module
import { Router } from "express"
import { validateRequest } from "../../middleware/validateRequest"

import { Role } from "../../../generated/prisma/enums"
import auth from "../../middleware/Auth"
import { ReviewsControllers } from "./reviews.controller"
import { createReviewsData, moderateData, updateReviewsData } from "./reviews.validation"

const router=Router()
router.get("/reviews", ReviewsControllers.getAllreviews)
router.get(
  "/my-reviews",
  auth([Role.USER, Role.ADMIN]),
  ReviewsControllers.getReviewsByRole
)

router.post("/event/:id/review",validateRequest(createReviewsData),auth([Role.USER]),ReviewsControllers.CreateReviews)

router.put("/review/:reviewid", auth([Role.USER]),validateRequest(updateReviewsData), ReviewsControllers.updateReview)
router.delete("/review/:reviewid", auth([Role.ADMIN,Role.USER,Role.MANAGER]), ReviewsControllers.deleteReview)

router.put("/review/:reviewid/moderate",auth([Role.MANAGER,Role.ADMIN]),ReviewsControllers.moderateReview)
export const ReviewsRouters=router