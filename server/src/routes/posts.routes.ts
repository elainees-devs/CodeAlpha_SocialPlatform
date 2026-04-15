import { Router } from "express";
import asyncHandler from "express-async-handler";

import { postController } from "../controllers";
import { authenticateMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * Create a post
 */
router.post(
  "/",
  authenticateMiddleware,
  asyncHandler(postController.createPost)
);

/**
 * Get post by ID
 */
router.get(
  "/:id",
  asyncHandler(postController.getPostById)
);

/**
 * Get posts by user
 */
router.get(
  "/user/:userId",
  asyncHandler(postController.getPostsByUser)
);

router.get(
  "/",
  asyncHandler(postController.getAllPosts)
);

/**
 * Delete post (only owner)
 */
router.delete(
  "/:id",
  authenticateMiddleware,
  asyncHandler(postController.deletePost)
);

export default router;