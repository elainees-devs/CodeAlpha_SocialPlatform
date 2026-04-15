import { Request, Response } from "express";
import { ApiError } from "../utils";
import { commentModel } from "../models";

class CommentController {
  /**
   * Create comment
   */
  async createComment(req: Request, res: Response) {
    const user_id = (req as any).user?.id;
    const { post_id, content } = req.body;

    if (!user_id) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!post_id || !content) {
      throw new ApiError(400, "post_id and content are required");
    }

    const comment = await commentModel.create(
      Number(user_id),
      Number(post_id),
      content,
    );

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: comment,
    });
  }

  /**
   * Get comments for a post
   */
  async getCommentsByPost(req: Request, res: Response) {
    const post_id = Number(req.params.postId);

    if (!post_id) {
      throw new ApiError(400, "postId is required");
    }

    const comments = await commentModel.findByPostId(post_id);

    res.status(200).json({
      success: true,
      data: comments,
    });
  }

  /**
   * Delete comment
   */
  async deleteComment(req: Request, res: Response) {
    const user_id = (req as any).user?.id;
    const id = Number(req.params.id);

    if (!user_id) {
      throw new ApiError(401, "Unauthorized");
    }

    const deleted = await commentModel.delete(id, Number(user_id));

    if (!deleted) {
      throw new ApiError(404, "Comment not found or not owned by user");
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  }
}

export const commentController = new CommentController();
