// src/services/follows.service.ts
import { prisma } from "../utils";

class FollowService {
  // ======================
  // FOLLOW
  // ======================
  async follow(follower_id: number, following_id: number) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.follow.findUnique({
        where: {
          follower_id_following_id: {
            follower_id,
            following_id,
          },
        },
      });

      if (existing) {
        return existing;
      }

      const follow = await tx.follow.create({
        data: { follower_id, following_id },
      });

      return follow;
    });
  }

  // ======================
  // UNFOLLOW
  // ======================
  async unfollow(follower_id: number, following_id: number) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.follow.findUnique({
        where: {
          follower_id_following_id: {
            follower_id,
            following_id,
          },
        },
      });

      if (!existing) return false;

      await tx.follow.delete({
        where: {
          follower_id_following_id: {
            follower_id,
            following_id,
          },
        },
      });

      return true;
    });
  }

  // ======================
  // CHECK FOLLOW
  // ======================
  async isFollowing(
    follower_id: number,
    following_id: number
  ): Promise<boolean> {
    const follow = await prisma.follow.findUnique({
      where: {
        follower_id_following_id: {
          follower_id,
          following_id,
        },
      },
      select: { id: true },
    });

    return !!follow;
  }

  // ======================
  // TOGGLE FOLLOW
  // ======================
  async toggleFollow(follower_id: number, following_id: number) {
    const exists = await this.isFollowing(follower_id, following_id);

    if (exists) {
      await this.unfollow(follower_id, following_id);
      return { following: false };
    }

    const follow = await this.follow(follower_id, following_id);

    return {
      following: true,
      data: follow,
    };
  }

  // ======================
  // GET FOLLOWERS
  // ======================
  async getFollowers(user_id: number) {
    return prisma.follow.findMany({
      where: { following_id: user_id },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            avatar_url: true,
            bio: true,
          },
        },
      },
    });
  }

  // ======================
  // GET FOLLOWING
  // ======================
  async getFollowing(user_id: number) {
    return prisma.follow.findMany({
      where: { follower_id: user_id },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            avatar_url: true,
            bio: true,
          },
        },
      },
    });
  }
}

export const followService = new FollowService();