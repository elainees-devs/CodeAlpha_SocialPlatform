// src/routes/users.route.ts
import { Router } from "express";
import asyncHandler from "express-async-handler";
import { userController } from "../controllers";
import { authenticateMiddleware } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

/**
 * Get all users
 */
router.get(
  "/",
  asyncHandler(userController.findAllUsers)
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
  upload.single("avatar"),
  asyncHandler(userController.updateProfile)
);

/**
 * Get user by ID
 */
router.get(
  "/:id",
  asyncHandler(userController.findUserById)
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