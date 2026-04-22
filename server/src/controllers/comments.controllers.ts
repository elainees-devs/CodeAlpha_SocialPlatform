import { Request, Response, NextFunction } from "express";
import { commentService } from "../services";
import { ApiError } from "../utils";

class CommentController {
  // ======================
  // CREATE COMMENT
  // ======================
  createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        throw new ApiError(401, "Unauthorized");
      }

      const user_id = user.id;
      const { postId, content } = req.body;
      const post_id = Number(postId);

      if (!post_id) {
        throw new ApiError(400, "Post ID is required");
      }

      if (!content || content.trim().length === 0) {
        throw new ApiError(400, "Comment content is required");
      }

      const comment = await commentService.createComment(
        user_id,
        post_id,
        content
      );

      res.status(201).json({
        success: true,
        message: "Comment added successfully",
        data: comment,
      });
    } catch (error) {
      next(error); 
    }
  };

  // ======================
  // GET COMMENTS BY POST
  // ======================
  findCommentsByPostId = async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (error) {
      next(error); // ✅ FIXED
    }
  };

  // ======================
  // DELETE COMMENT
  // ======================
  deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        throw new ApiError(401, "Unauthorized");
      }

      const user_id = user.id;
      const id = Number(req.params.id);

      const success = await commentService.deleteComment(id, user_id);

      if (!success) {
        throw new ApiError(
          403,
          "You are not authorized to delete this comment or it does not exist"
        );
      }

      res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

export const commentController = new CommentController();