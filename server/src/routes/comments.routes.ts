import { Router } from "express";
import asyncHandler from "express-async-handler";

import { commentController } from "../controllers";
import { authenticateMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * Create comment
 */
router.post(
  "/",
  authenticateMiddleware,
  asyncHandler(commentController.createComment)
);

/**
 * Get comments for a post
 */
router.get(
  "/post/:postId",
  asyncHandler(commentController.getCommentsByPost)
);

/**
 * Delete comment (owner only)
 */
router.delete(
  "/:id",
  authenticateMiddleware,
  asyncHandler(commentController.deleteComment)
);

export default router;