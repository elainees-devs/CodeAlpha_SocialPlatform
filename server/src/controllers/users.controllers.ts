// src/controllers/users.controllers.ts
import { Request, Response } from "express";
import { userService } from "../services";
import { ApiError } from "../utils";

class UserController {
  /**
   * Create a new user
   */
  async createUser(req: Request, res: Response): Promise<void> {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  }

  /**
   * Get user by ID
   */
  async findUserById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (!id) throw new ApiError(400, "User ID is required");

    const user = await userService.findUserById(id);
    if (!user) throw new ApiError(404, "User not found");

    res.status(200).json({
      success: true,
      data: user,
    });
  }

  /**
   * Get all users
   */
  async findAllUsers(_req: Request, res: Response): Promise<void> {
    const users = await userService.findAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  }

  /**
   * Get currently logged in user profile
   */
  async getMe(req: Request, res: Response): Promise<void> {
    // 1. Extract user ID attached by your authMiddleware
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new ApiError(401, "Not authenticated");
    }

    // 2. Fetch the latest user data from the database
    const user = await userService.findUserById(userId);

    if (!user) {
      throw new ApiError(404, "User profile not found");
    }

    // 3. Return the user profile
    res.status(200).json({
      success: true,
      data: user,
    });
  }

  /**
   * Find user by email
   */
  async findUserByEmail(req: Request, res: Response): Promise<void> {
    const email = req.params.email as string;
    if (!email) throw new ApiError(400, "Email is required");

    const user = await userService.findUserByEmail(email);
    if (!user) throw new ApiError(404, "User not found");

    res.status(200).json({
      success: true,
      data: user,
    });
  }

  /**
   * Find user by username
   */
  async findUserByUsername(req: Request, res: Response): Promise<void> {
    const username = req.params.username as string;
    if (!username) throw new ApiError(400, "Username is required");

    const user = await userService.findUserByUsername(username);
    if (!user) throw new ApiError(404, "User not found");

    res.status(200).json({
      success: true,
      data: user,
    });
  }

  /**
 * Update user profile 
 */
async updateProfile(req: Request, res: Response): Promise<void> {
  const userIdFromToken = (req as any).user?.id;

  if (!userIdFromToken) {
    throw new ApiError(401, "Unauthorized");
  }

  const updated = await userService.updateProfile(
    userIdFromToken,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updated,
  });
}
  /**
   * Delete user (SECURE)
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    const userIdFromToken = (req as any).user?.id;
    const idToDelete = Number(req.params.id);

    if (userIdFromToken !== idToDelete) {
      throw new ApiError(403, "You can only delete your own account");
    }

    await userService.deleteUser(idToDelete);

    // Add this to finalize the request
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  }
  /**
   * Toggle user online status
   */
  async toggleStatus(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (!id) throw new ApiError(400, "User ID is required");

    const status = await userService.toggleStatus(id);

    res.status(200).json({
      success: true,
      data: {
        is_online: status,
      },
    });
  }
}

export const userController = new UserController();