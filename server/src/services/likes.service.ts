// src/services/likes.service.ts
import { prisma } from "../utils";

class LikeService {
  // ======================
  // ADD LIKE (SAFE)
  // ======================
  async addLike(user_id: number, post_id: number) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.like.findUnique({
        where: {
          user_id_post_id: {
            user_id,
            post_id,
          },
        },
      });

      if (existing) {
        return existing;
      }

      const like = await tx.like.create({
        data: { user_id, post_id },
      });

      await tx.post.update({
        where: { id: post_id },
        data: {
          likes_count: { increment: 1 },
        },
      });

      return like;
    });
  }

  // ======================
  // REMOVE LIKE (SAFE)
  // ======================
  async removeLike(user_id: number, post_id: number): Promise<boolean> {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.like.findUnique({
        where: {
          user_id_post_id: {
            user_id,
            post_id,
          },
        },
      });

      if (!existing) return false;

      await tx.like.delete({
        where: {
          user_id_post_id: {
            user_id,
            post_id,
          },
        },
      });

      await tx.post.update({
        where: { id: post_id },
        data: {
          likes_count: { decrement: 1 },
        },
      });

      return true;
    });
  }

  // ======================
  // CHECK IF LIKED (OPTIMIZED)
  // ======================
  async isLiked(user_id: number, post_id: number): Promise<boolean> {
    const like = await prisma.like.findUnique({
      where: {
        user_id_post_id: {
          user_id,
          post_id,
        },
      },
      select: { id: true },
    });

    return !!like;
  }

  // ======================
  // TOGGLE LIKE (ATOMIC)
  // ======================
  async toggleLike(user_id: number, post_id: number) {
    const exists = await this.isLiked(user_id, post_id);

    if (exists) {
      await this.removeLike(user_id, post_id);
      return { liked: false };
    }

    await this.addLike(user_id, post_id);
    return { liked: true };
  }
}

export const likeService = new LikeService();