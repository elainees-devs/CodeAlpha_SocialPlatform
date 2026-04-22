// src/services/comments.service.ts
import { Comment } from "@prisma/client";
import { IComment } from "../types";
import { prisma } from "../utils";

class CommentService {
  // ======================
  // MAP COMMENT
  // ======================
  private mapComment(c: Comment): IComment {
    return {
      id: c.id,
      user_id: c.user_id,
      post_id: c.post_id,
      content: c.content,
      created_at: c.created_at.toISOString(),
    };
  }

  // ======================
  // CREATE COMMENT (SAFE)
  // ======================
  async createComment(
    user_id: number,
    post_id: number,
    content: string
  ): Promise<IComment> {
    return prisma.$transaction(async (tx) => {
      const post = await tx.post.findUnique({
        where: { id: post_id },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      const comment = await tx.comment.create({
        data: {
          user_id,
          post_id,
          content,
        },
      });

      await tx.post.update({
        where: { id: post_id },
        data: {
          comments_count: { increment: 1 },
        },
      });

      return this.mapComment(comment);
    });
  }

  // ======================
  // GET COMMENTS BY POST
  // ======================
  async findCommentsByPostId(post_id: number): Promise<IComment[]> {
    const comments = await prisma.comment.findMany({
      where: { post_id },
      orderBy: { created_at: "asc" },
    });

    return comments.map((c) => this.mapComment(c));
  }

  // ======================
  // DELETE COMMENT (SAFE)
  // ======================
  async deleteComment(id: number, user_id: number): Promise<boolean> {
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