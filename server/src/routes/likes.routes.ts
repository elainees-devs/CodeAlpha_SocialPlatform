import { Router } from "express";
import asyncHandler from "express-async-handler";

import { likeController } from "../controllers";
import { authenticateMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/:postId",
  authenticateMiddleware,
  asyncHandler(likeController.toggleLike)
);


/**
 * Check if user liked a post
 */
router.get(
  "/:postId",
  authenticateMiddleware,
  asyncHandler(likeController.checkLike)
);

export default router;