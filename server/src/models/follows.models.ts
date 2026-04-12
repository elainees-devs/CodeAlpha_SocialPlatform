import { Follow } from "@prisma/client";
import { IFollow } from "../types";
import { prisma } from "../utils";

class FollowModel {
  private mapFollow(f: Follow): IFollow {
    return {
      id: f.id,
      follower_id: f.follower_id,
      following_id: f.following_id,
      created_at: f.created_at.toISOString(),
    };
  }

  async follow(follower_id: number, following_id: number): Promise<IFollow> {
    if (follower_id === following_id) throw new Error("You cannot follow yourself");

    const follow = await prisma.follow.create({
      data: { follower_id, following_id },
    });
    return this.mapFollow(follow);
  }

  async unfollow(follower_id: number, following_id: number): Promise<boolean> {
    const deleted = await prisma.follow.deleteMany({
      where: { follower_id, following_id },
    });
    return deleted.count > 0;
  }

  async getFollowers(user_id: number): Promise<IFollow[]> {
    const followers = await prisma.follow.findMany({
      where: { following_id: user_id },
    });
    return followers.map(this.mapFollow);
  }

  async getFollowing(user_id: number): Promise<IFollow[]> {
    const following = await prisma.follow.findMany({
      where: { follower_id: user_id },
    });
    return following.map(this.mapFollow);
  }
}

export const followModel = new FollowModel();