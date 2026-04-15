import { Request, Response } from "express";
import { ApiError } from "../utils";
import { followModel } from "../models";

class FollowController {
  /**
   * Toggle follow/unfollow a user
   */
  async followUser(req: Request, res: Response) {
  const follower_id = (req as any).user?.id;
  const following_id = Number(req.params.user_id);

  if (!follower_id) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!following_id) {
    throw new ApiError(400, "User id is required");
  }

  if (follower_id === following_id) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  const result = await followModel.toggleFollow(follower_id, following_id);

  res.status(200).json({
    success: true,
    message: result.following
      ? "User followed successfully"
      : "User unfollowed successfully",
    data: result,
  });
}

  /**
   * Unfollow a user (kept for compatibility, but uses toggle internally)
   */
  async unfollowUser(req: Request, res: Response) {
    const follower_id = (req as any).user?.id;
    const following_id = Number(req.params.user_id);

    if (!follower_id) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!following_id) {
      throw new ApiError(400, "User id is required");
    }

    const result = await followModel.toggleFollow(follower_id, following_id);

    res.status(200).json({
      success: true,
      message: result.following
        ? "User followed successfully"
        : "User unfollowed successfully",
      data: result,
    });
  }

  /**
   * Get followers of a user
   */
  async getFollowers(req: Request, res: Response) {
    const user_id = Number(req.params.user_id);

    if (!user_id) {
      throw new ApiError(400, "User id is required");
    }

    const followers = await followModel.getFollowers(user_id);

    res.status(200).json({
      success: true,
      data: followers,
    });
  }

  /**
   * Get users a person follows
   */
  async getFollowing(req: Request, res: Response) {
    const user_id = Number(req.params.user_id);

    if (!user_id) {
      throw new ApiError(400, "User id is required");
    }

    const following = await followModel.getFollowing(user_id);

    res.status(200).json({
      success: true,
      data: following,
    });
  }

  
}

export const followController = new FollowController();
