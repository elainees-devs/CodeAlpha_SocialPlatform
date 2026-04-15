import { Request, Response } from "express";
import { ApiError } from "../utils";
import { userModel } from "../models";

class UserController {
  /**
   * Get all users
   */
  async getAllUsers(req: Request, res: Response) {
    const users = await userModel.findAll();

    res.status(200).json({
      success: true,
      data: users,
    });
  }

  /**
   * Get user by ID
   */
  async getUserById(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (!id) {
      throw new ApiError(400, "User id is required");
    }

    const user = await userModel.findById(id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }

  /**
   * Get current authenticated user
   */
  async getMe(req: Request, res: Response) {
    const user_id = (req as any).user?.id;

    if (!user_id) {
      throw new ApiError(401, "Unauthorized");
    }

    const user = await userModel.findById(user_id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }

  /**
   * Update profile
   */
  async updateProfile(req: Request, res: Response) {
    const user_id = (req as any).user?.id;

    if (!user_id) {
      throw new ApiError(401, "Unauthorized");
    }

    const updatedUser = await userModel.updateProfile(user_id, req.body);

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  }

  /**
   * Delete user
   */
  async deleteUser(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (!id) {
      throw new ApiError(400, "User id is required");
    }

    const deleted = await userModel.delete(id);

    if (!deleted) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  }

  /**
   * Toggle online status
   */
  async toggleStatus(req: Request, res: Response) {
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const status = await userModel.toggleStatus(userId);

    res.status(200).json({
      success: true,
      data: { is_online: status },
    });
  }
}

export const userController = new UserController();