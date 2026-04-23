// src/controllers/follows.controllers.ts
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils";
import { followService } from "../services";

class FollowController {
  /**
   * Toggle follow/unfollow a user
   */
  followUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const follower_id = (req as any).user?.id;
      const following_id = Number(req.params.user_id);

      if (!follower_id) {
        throw new ApiError(401, "Unauthorized");
      }

      if (Number.isNaN(following_id)) {
        throw new ApiError(400, "Invalid user id");
      }

      if (follower_id === following_id) {
        throw new ApiError(400, "You cannot follow yourself");
      }

      const result = await followService.toggleFollow(
        follower_id,
        following_id
      );

      res.status(200).json({
        success: true,
        message: result.following
          ? "User followed successfully"
          : "User unfollowed successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get followers of a user
   */
  getFollowers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = Number(req.params.user_id);

      if (Number.isNaN(user_id)) {
        throw new ApiError(400, "Invalid user id");
      }

      const followers = await followService.getFollowers(user_id);

      res.status(200).json({
        success: true,
        data: followers,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get users a person follows
   */
  getFollowing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = Number(req.params.user_id);

      if (Number.isNaN(user_id)) {
        throw new ApiError(400, "Invalid user id");
      }

      const following = await followService.getFollowing(user_id);

      res.status(200).json({
        success: true,
        data: following,
      });
    } catch (error) {
      next(error);
    }
  };

async getSuggestions(req: Request, res: Response, next: NextFunction) {
  try {
    const user_id = (req as any).user?.id;

    if (!user_id) {
      throw new ApiError(401, "Unauthorized");
    }

    const users = await followService.getSuggestions(user_id);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}
}

export const followController = new FollowController();