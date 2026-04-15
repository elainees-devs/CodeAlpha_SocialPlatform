import { prisma } from "../utils";

class FollowModel {
  // CREATE FOLLOW
  async follow(follower_id: number, following_id: number) {
    try {
      const follow = await prisma.follow.create({
        data: { follower_id, following_id },
      });

      return follow;
    } catch (err) {
      throw err;
    }
  }

  // REMOVE FOLLOW
  async unfollow(follower_id: number, following_id: number) {
    const result = await prisma.follow.deleteMany({
      where: { follower_id, following_id },
    });

    return result.count > 0;
  }

  // CHECK IF FOLLOW EXISTS
  async isFollowing(follower_id: number, following_id: number) {
    const count = await prisma.follow.count({
      where: { follower_id, following_id },
    });

    return count > 0;
  }

  // TOGGLE FOLLOW (LIKE-STYLE)
  async toggleFollow(follower_id: number, following_id: number) {
    const exists = await this.isFollowing(follower_id, following_id);

    if (exists) {
      await this.unfollow(follower_id, following_id);

      return {
        following: false,
      };
    }

    const follow = await this.follow(follower_id, following_id);

    return {
      following: true,
      data: follow,
    };
  }

  // GET FOLLOWERS
  async getFollowers(user_id: number) {
    return prisma.follow.findMany({
      where: { following_id: user_id },
    });
  }

  // GET FOLLOWING
  async getFollowing(user_id: number) {
    return prisma.follow.findMany({
      where: { follower_id: user_id },
    });
  }
}

export const followModel = new FollowModel();