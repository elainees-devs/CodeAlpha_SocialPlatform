// src/controllers/comments.controllers.ts
import { Request, Response } from "express";
import { commentService } from "../services";
import { ApiError } from "../utils";

class CommentController {
  // ======================
  // CREATE COMMENT
  // ======================
  createComment = async (req: Request, res: Response) => {
    try {
      const user_id = (req as any).user?.id;
      const post_id = Number(req.params.postId);
      const { content } = req.body;

      if (!content || content.trim().length === 0) {
        throw new ApiError(400, "Comment content is required");
      }

      if (!post_id) {
        throw new ApiError(400, "Post ID is required");
      }

      const comment = await commentService.createComment(user_id, post_id, content);

      res.status(201).json({
        success: true,
        message: "Comment added successfully",
        data: comment,
      });
    } catch (error: any) {
      // If service throws "Post not found", propagate it
      const status = error.message === "Post not found" ? 404 : 400;
      throw new ApiError(status, error.message);
    }
  };

  // ======================
  // GET COMMENTS BY POST
  // ======================
  findCommentsByPostId = async (req: Request, res: Response) => {
    try {
      const post_id = Number(req.params.postId);

      if (!post_id) {
        throw new ApiError(400, "Invalid post ID");
      }

      const comments = await commentService.findCommentsByPostId(post_id);

      res.status(200).json({
        success: true,
        data: comments,
      });
    } catch (error: any) {
      throw new ApiError(400, error.message);
    }
  };

  // ======================
  // DELETE COMMENT
  // ======================
  deleteComment = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const user_id = (req as any).user?.id;

      const success = await commentService.deleteComment(id, user_id);

      if (!success) {
        throw new ApiError(403, "You are not authorized to delete this comment or it does not exist");
      }

      res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
      });
    } catch (error: any) {
      throw new ApiError(400, error.message);
    }
  };
}

export const commentController = new CommentController();