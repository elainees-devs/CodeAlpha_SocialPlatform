import { Router } from "express";
import asyncHandler from "express-async-handler";
import { followController } from "../controllers";
import { authenticateMiddleware } from "../middlewares";


const router = Router();

/**
 * Follow / Unfollow user (toggle)
 */
router.post(
  "/:user_id",
  authenticateMiddleware,
  asyncHandler(followController.followUser)
);

/**
 * Unfollow user (kept for compatibility)
 */
router.delete(
  "/:user_id",
  authenticateMiddleware,
  asyncHandler(followController.unfollowUser)
);

/**
 * Get followers of a user
 */
router.get(
  "/followers/:user_id",
  asyncHandler(followController.getFollowers)
);

/**
 * Get following of a user
 */
router.get(
  "/following/:user_id",
  asyncHandler(followController.getFollowing)
);

export default router;