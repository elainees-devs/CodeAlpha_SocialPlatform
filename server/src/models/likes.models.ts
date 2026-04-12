import { Like } from "@prisma/client";
import { ILike } from "../types";
import { prisma } from "../utils";

class LikeModel {
  private mapLike(l: Like): ILike {
    return {
      id: l.id,
      user_id: l.user_id!,
      post_id: l.post_id!,
      created_at: l.created_at.toISOString(),
    };
  }

  async addLike(user_id: number, post_id: number): Promise<ILike> {
    const like = await prisma.like.create({
      data: { user_id, post_id },
    });
    return this.mapLike(like);
  }

  async removeLike(user_id: number, post_id: number): Promise<boolean> {
    const deleted = await prisma.like.deleteMany({
      where: { user_id, post_id },
    });
    return deleted.count > 0;
  }

  async isLiked(user_id: number, post_id: number): Promise<boolean> {
    const count = await prisma.like.count({
      where: { user_id, post_id },
    });
    return count > 0;
  }
}

export const likeModel = new LikeModel();