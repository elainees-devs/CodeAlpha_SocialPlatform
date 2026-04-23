// src/routes/follows.routes.ts
import { Router } from "express";
import asyncHandler from "express-async-handler";
import { followController } from "../controllers";
import { authenticateMiddleware } from "../middlewares";

const router = Router();

/**
 * Toggle follow / unfollow a user
 * (acts like a relationship resource)
 */
router.post(
  "/:user_id/follow",
  authenticateMiddleware,
  asyncHandler(followController.followUser)
);

/**
 * Get followers of a user
 */
router.get(
  "/:user_id/followers",
  asyncHandler(followController.getFollowers)
);

/**
 * Get users that a user is following
 */
router.get(
  "/:user_id/following",
  asyncHandler(followController.getFollowing)
);

/**
 * Get follow suggestions for current authenticated user
 */
router.get(
  "/suggestions",
  authenticateMiddleware,
  asyncHandler(followController.getSuggestions)
);

export default router;