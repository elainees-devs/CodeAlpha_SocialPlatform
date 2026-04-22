// src/routes/posts.routes.ts
import { Router } from "express";
import asyncHandler from "express-async-handler";
import { postController } from "../controllers";
import { authenticateMiddleware } from "../middlewares";

const router = Router();

/**
 * Get feed (paginated)
 */

router.get(
  "/feed",
  asyncHandler(postController.getFeed)
);

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
  asyncHandler(postController.getUserPosts)
);

/**
 * Toggle Like / Unlike
 */
router.post(
  "/:id/like",
  authenticateMiddleware,
  asyncHandler(postController.toggleLike)
);

/**
 * Add comment
 */
router.post(
  "/:id/comment",
  authenticateMiddleware,
  asyncHandler(postController.addComment)
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