// route for reviews module
import { Router } from "express"
import { validateRequest } from "../../middleware/validateRequest"

import { Role } from "../../../generated/prisma/enums"
import auth from "../../middleware/Auth"
import { ReviewsControllers } from "./reviews.controller"
import { createReviewsData, updateReviewsData } from "./reviews.validation"

const router=Router()
router.get("/reviews", ReviewsControllers.getAllreviews)
router.post("/event/:id/review",validateRequest(createReviewsData),auth([Role.USER]),ReviewsControllers.CreateReviews)

router.put("/review/:reviewid", auth([Role.USER]),validateRequest(updateReviewsData), ReviewsControllers.updateReview)
router.delete("/review/:reviewid", auth([Role.ADMIN,Role.USER]), ReviewsControllers.deleteReview)
export const ReviewsRouters=router