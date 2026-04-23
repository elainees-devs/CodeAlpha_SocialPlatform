import { prisma } from "../utils";

class FollowService {
  // ======================
  // TOGGLE FOLLOW (MAIN METHOD)
  // ======================
  async toggleFollow(follower_id: number, following_id: number) {
    if (follower_id === following_id) {
      throw new Error("You cannot follow yourself");
    }

    return prisma.$transaction(async (tx) => {
      const existing = await tx.follow.findUnique({
        where: {
          follower_id_following_id: {
            follower_id,
            following_id,
          },
        },
      });

      // UNFOLLOW
      if (existing) {
        await tx.follow.delete({
          where: {
            follower_id_following_id: {
              follower_id,
              following_id,
            },
          },
        });

        return { following: false };
      }

      // FOLLOW
      const follow = await tx.follow.create({
        data: { follower_id, following_id },
      });

      return {
        following: true,
        data: follow,
      };
    });
  }

  // ======================
  // IS FOLLOWING
  // ======================
  async isFollowing(follower_id: number, following_id: number) {
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

// ======================
// FOLLOW SUGGESTIONS
// ======================
async getSuggestions(user_id: number) {

  // 1. Get users the current user already follows
  const following = await prisma.follow.findMany({
    where: { follower_id: user_id },
    select: { following_id: true },
  });

  const followingIds = following.map(f => f.following_id);

  // 2. Find candidate users (not me + not already followed)
  const users = await prisma.user.findMany({
    where: {
      id: {
        notIn: [...followingIds, user_id],
      },
    },
    select: {
      id: true,
      username: true,
      avatar_url: true,
      bio: true,
      _count: {
        select: {
          followers: true, // popularity
        },
      },
    },
    take: 10,
  });

  // 3. Sort by popularity
  const ranked = users.sort(
    (a, b) => b._count.followers - a._count.followers
  );

  return ranked.map((u) => ({
    id: u.id,
    username: u.username,
    avatar_url: u.avatar_url,
    bio: u.bio,
  }));
}
}

export const followService = new FollowService();