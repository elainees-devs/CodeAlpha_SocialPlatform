import { Comment } from "@prisma/client";
import { IComment } from "../types";
import { prisma } from "../utils";

class CommentModel {
  private mapComment(c: Comment): IComment {
    return {
      id: c.id,
      user_id: c.user_id!,
      post_id: c.post_id!,
      content: c.content,
      created_at: c.created_at.toISOString(),
    };
  }

  async create(user_id: number, post_id: number, content: string): Promise<IComment> {
    const comment = await prisma.comment.create({
      data: { user_id, post_id, content },
    });
    return this.mapComment(comment);
  }

  async findByPostId(post_id: number): Promise<IComment[]> {
    const comments = await prisma.comment.findMany({
      where: { post_id },
      orderBy: { created_at: "asc" },
    });
    return comments.map(this.mapComment);
  }

  async delete(id: number, user_id: number): Promise<boolean> {
    const deleted = await prisma.comment.deleteMany({
      where: { id, user_id }, // Ensure user owns the comment
    });
    return deleted.count > 0;
  }
}

export const commentModel = new CommentModel();