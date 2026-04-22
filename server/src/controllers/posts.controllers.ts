// src/controllers/posts.controllers.ts
import { Request, Response } from "express";
import { postService } from "../services";
import { ApiError } from "../utils";

class PostController {
  /**
   * Create a new post
   */
  async createPost(req: Request, res: Response): Promise<void> {
    const user_id = (req as any).user?.id;
    const { content, image_url } = req.body;

    if (!user_id) throw new ApiError(401, "Unauthorized");
    if (!content) throw new ApiError(400, "Content is required");

    const post = await postService.create({ 
      user_id, 
      content, 
      image_url 
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  }

  /**
   * Get paginated feed
   */
  async getFeed(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await postService.getFeed(userId, page, limit);

    res.status(200).json({
      success: true,
      data: result.posts,
      pagination: {
        total: result.total,
        totalPages: result.totalPages,
        currentPage: page,
      },
    });
  }

  /**
   * Get post by ID
   */
  async getPostById(req: Request, res: Response): Promise<void> {
    const postId = Number(req.params.id);
    const userId = (req as any).user?.id;

    if (!postId) throw new ApiError(400, "Invalid post ID");

    const post = await postService.findById(postId, userId);
    if (!post) throw new ApiError(404, "Post not found");

    res.status(200).json({
      success: true,
      data: post,
    });
  }

  /**
   * Get all posts from a specific user
   */
  async getUserPosts(req: Request, res: Response): Promise<void> {
    const userId = Number(req.params.userId);
    if (!userId) throw new ApiError(400, "User ID is required");

    const posts = await postService.getUserPosts(userId);

    res.status(200).json({
      success: true,
      data: posts,
    });
  }

  /**
   * Toggle Like/Unlike
   */
  async toggleLike(req: Request, res: Response): Promise<void> {
    const postId = Number(req.params.id);
    const userId = (req as any).user?.id;

    if (!userId) throw new ApiError(401, "Unauthorized");
    if (!postId) throw new ApiError(400, "Post ID is required");

    const result = await postService.toggleLike(postId, userId);

    res.status(200).json({
      success: true,
      message: result.isLiked ? "Post liked" : "Post unliked",
      data: result,
    });
  }

  /**
   * Add a comment to a post
   */
  async addComment(req: Request, res: Response): Promise<void> {
    const post_id = Number(req.params.id);
    const user_id = (req as any).user?.id;
    const { content } = req.body;

    if (!user_id) throw new ApiError(401, "Unauthorized");
    if (!post_id) throw new ApiError(400, "Post ID is required");
    if (!content || content.trim().length === 0) {
      throw new ApiError(400, "Comment content cannot be empty");
    }

    const comment = await postService.addComment({
      post_id,
      user_id,
      content,
    });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  }

  /**
   * Delete a post (Secure)
   */
  async deletePost(req: Request, res: Response): Promise<void> {
    const postId = Number(req.params.id);
    const userId = (req as any).user?.id;

    if (!userId) throw new ApiError(401, "Unauthorized");
    if (!postId) throw new ApiError(400, "Post ID is required");

    // The service handles ownership check
    await postService.delete(postId, userId);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  }
}

export const postController = new PostController();