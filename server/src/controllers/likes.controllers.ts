import { Request, Response } from "express";
import { ApiError } from "../utils";
import { likeModel } from "../models";

class LikeController {
  /**
   * Like a post
   */
  async addLike(req: Request, res: Response): Promise<void> {
    const user_id = (req as any).user?.id;
    const post_id = Number(req.params.postId);

    if (!user_id) throw new ApiError(401, "Unauthorized");
    if (!post_id) throw new ApiError(400, "Post id is required");

    const exists = await likeModel.isLiked(user_id, post_id);
    if (exists) throw new ApiError(400, "Post already liked");

    const like = await likeModel.addLike(user_id, post_id);

    res.status(201).json({
      success: true,
      message: "Post liked",
      data: like,
    });

    return;
  }

  /**
   * Unlike a post
   */
  async removeLike(req: Request, res: Response): Promise<void> {
    const user_id = (req as any).user?.id;
    const post_id = Number(req.params.postId);

    if (!user_id) throw new ApiError(401, "Unauthorized");
    if (!post_id) throw new ApiError(400, "Post id is required");

    const removed = await likeModel.removeLike(user_id, post_id);

    if (!removed) throw new ApiError(404, "Like not found");

    res.status(201).json({
      success: true,
      message: "Unliked post",
    });

    return;
  }

    /**
   * Check if user liked a post
   */
  async checkLike(req: Request, res: Response): Promise<void> {
    const user_id = (req as any).user?.id;
    const post_id = Number(req.params.postId);

    if (!user_id) throw new ApiError(401, "Unauthorized");
    if (!post_id) throw new ApiError(400, "Post id is required");

    const liked = await likeModel.isLiked(user_id, post_id);

    res.status(200).json({
      success: true,
      data: {
        liked,
      },
    });
  }
  /**
   * Toggle like (LIKE / UNLIKE)
   * @param req 
   * @param res 
   */
async toggleLike(req: Request, res: Response): Promise<void> {
  const user_id = (req as any).user?.id;
  const post_id = Number(req.params.postId);

  if (!user_id) throw new ApiError(401, "Unauthorized");
  if (!post_id) throw new ApiError(400, "Post id is required");

  const result = await likeModel.toggleLike(user_id, post_id);

  if (result.liked) {
    res.status(201).json({
      success: true,
      message: "Post liked",
    });
  } else {
    res.status(200).json({
      success: true,
      message: "Unliked post",
    });
  }
}


}

export const likeController = new LikeController();