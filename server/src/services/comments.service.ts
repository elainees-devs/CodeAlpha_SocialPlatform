// src/services/comments.service.ts
import { prisma } from "../utils";
import { ICommentResponse } from "../types";

class CommentService {
  // ======================
  // MAP COMMENT (DB -> API)
  // ======================
  private mapComment(c: any): ICommentResponse {
    return {
      id: c.id,
      post_id: c.post_id,
      content: c.content,
      created_at: c.created_at.toISOString(),

      author: {
        id: c.user.id,
        username: c.user.username,
        email: c.user.email,
        bio: c.user.bio,
        avatar_url: c.user.avatar_url,
        is_online: c.user.is_online,
        created_at: c.user.created_at.toISOString(),
        updated_at: c.user.updated_at.toISOString(),
      },
    };
  }

  // ======================
  // CREATE COMMENT
  // ======================
  async createComment(
    user_id: number,
    post_id: number,
    content: string
  ): Promise<ICommentResponse> {
    return prisma.$transaction(async (tx) => {
      // 1. check post exists
      const post = await tx.post.findUnique({
        where: { id: post_id },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      // 2. create comment
      const comment = await tx.comment.create({
        data: {
          user_id,
          post_id,
          content,
        },
      });

      // 3. update post counter
      await tx.post.update({
        where: { id: post_id },
        data: {
          comments_count: { increment: 1 },
        },
      });

      // 4. re-fetch WITH user relation (IMPORTANT)
      const fullComment = await tx.comment.findUnique({
        where: { id: comment.id },
        include: {
          user: true,
        },
      });

      if (!fullComment) {
        throw new Error("Failed to fetch created comment");
      }

      return this.mapComment(fullComment);
    });
  }

  // ======================
  // GET COMMENTS BY POST
  // ======================
  async findCommentsByPostId(
    post_id: number
  ): Promise<ICommentResponse[]> {
    const comments = await prisma.comment.findMany({
      where: { post_id },
      include: {
        user: true,
      },
      orderBy: {
        created_at: "asc",
      },
    });

    return comments.map((c) => this.mapComment(c));
  }

  // ======================
  // DELETE COMMENT
  // ======================
  async deleteComment(
    id: number,
    user_id: number
  ): Promise<boolean> {
    return prisma.$transaction(async (tx) => {
      const comment = await tx.comment.findUnique({
        where: { id },
      });

      if (!comment || comment.user_id !== user_id) {
        return false;
      }

      await tx.comment.delete({
        where: { id },
      });

      await tx.post.update({
        where: { id: comment.post_id },
        data: {
          comments_count: { decrement: 1 },
        },
      });

      return true;
    });
  }
}

export const commentService = new CommentService();