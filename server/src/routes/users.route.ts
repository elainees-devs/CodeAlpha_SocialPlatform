import { Router } from "express";
import asyncHandler from "express-async-handler";
import { userController } from "../controllers";
import { authenticateMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * Get all users
 */
router.get(
  "/",
  asyncHandler(userController.getAllUsers)
);

/**
 * Get current authenticated user
 */
router.get(
  "/me",
  authenticateMiddleware,
  asyncHandler(userController.getMe)
);

/**
 * Toggle online status (current user)
 */
router.patch(
  "/status",
  authenticateMiddleware,
  asyncHandler(userController.toggleStatus)
);

/**
 * Update profile (current user)
 */
router.patch(
  "/profile",
  authenticateMiddleware,
  asyncHandler(userController.updateProfile)
);

/**
 * Get user by ID
 */
router.get(
  "/:id",
  asyncHandler(userController.getUserById)
);

/**
 * Delete user by ID
 */
router.delete(
  "/:id",
  authenticateMiddleware,
  asyncHandler(userController.deleteUser)
);

export default router;