import { Request, Response } from "express";
import { ApiError } from "../utils";
import { postModel } from "../models";

class PostController {
  /**
   * Create a post
   */
  async createPost(req: Request, res: Response) {
    const user_id = (req as any).user?.id;
    const { content, image_url } = req.body;

    if (!user_id) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!content) {
      throw new ApiError(400, "Post content is required");
    }

    const post = await postModel.create({
      user_id,
      content,
      image_url,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  }
  /**
   * Get all posts
   */
  async getAllPosts(req: Request, res: Response) {
    const posts = await postModel.getAllPosts();

    res.status(200).json({
      success: true,
      data: posts,
    });
  }

/**
 * Get post by ID
 */
async getPostById(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!id) {
    throw new ApiError(400, "Post id is required");
  }

  const post = await postModel.findById(id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  res.json({
    success: true,
    data: {
      ...post,
      likes_count: post.likes_count,
      comments_count: post.comments_count,
    },
  });
}
  /**
   * Get posts by user
   */
  async getPostsByUser(req: Request, res: Response) {
    const userId = Number(req.params.userId);

    if (!userId) {
      throw new ApiError(400, "User id is required");
    }

    const posts = await postModel.findByUserId(userId);

    res.status(200).json({
      success: true,
      data: posts,
    });
  }

  /**
   * Delete post
   */
  async deletePost(req: Request, res: Response) {
    const id = Number(req.params.id);
    const user_id = (req as any).user?.id;

    if (!user_id) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!id) {
      throw new ApiError(400, "Post id is required");
    }

    const post = await postModel.findById(id);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    if (post.user_id !== user_id) {
      throw new ApiError(403, "You can only delete your own posts");
    }

    await postModel.delete(id);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  }
}

export const postController = new PostController();
