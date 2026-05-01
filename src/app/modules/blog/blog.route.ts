import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";

import { Role } from "../../../generated/prisma/enums";
import auth from "../../middleware/Auth";
import { createBlogSchema, updateBlogSchema } from "./blog.validation";
import { BlogController } from "./blog.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router();

// Routes for blog CRUD
router.post(
    "/blog",
    auth([Role.ADMIN, Role.USER, Role.MANAGER]), 
    multerUpload.array("files"),
    validateRequest(createBlogSchema),
    BlogController.createBlog
  )

router.get(
  "/blogs",
  auth([Role.ADMIN, Role.USER]),
  BlogController.getAllBlogs
);

router.get(
  "/blog/:id",
  auth([Role.ADMIN, Role.USER]),
  BlogController.getSingleBlog
);

router.put(
  "/blog/:id",
  auth([Role.ADMIN, Role.USER]),
  validateRequest(updateBlogSchema),
  BlogController.updateBlog
);

router.delete(
  "/blog/:id",
  auth([Role.ADMIN, Role.USER]),
  BlogController.deleteBlog
);

export const BlogRouters = router;
