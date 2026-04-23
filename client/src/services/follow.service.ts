import api from "./api";
import { FollowUser } from "../types/follow.types";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

/**
 * Backend response shape for follower/following includes nested user objects
 */
type FollowRelation = {
  follower?: FollowUser;
  following?: FollowUser;
};

class FollowService {
  /**
   * Suggested users to follow
   */
  async getSuggestions(): Promise<FollowUser[]> {
    const { data } = await api.get<ApiResponse<FollowUser[]>>(
      "/follows/suggestions"
    );

    return data.data;
  }

  /**
   * Follow / Unfollow toggle
   */
  async toggleFollow(userId: number): Promise<{ following: boolean }> {
    const { data } = await api.post<
      ApiResponse<{ following: boolean }>
    >(`/follows/${userId}/follow`);

    return data.data;
  }

  /**
   * Get followers of a user
   */
  async getFollowers(userId: number): Promise<FollowUser[]> {
    const { data } = await api.get<ApiResponse<FollowRelation[]>>(
      `/follows/${userId}/followers`
    );

    return data.data
      .map((item) => item.follower)
      .filter((u): u is FollowUser => Boolean(u));
  }

  /**
   * Get users that a user is following
   */
  async getFollowing(userId: number): Promise<FollowUser[]> {
    const { data } = await api.get<ApiResponse<FollowRelation[]>>(
      `/follows/${userId}/following`
    );

    return data.data
      .map((item) => item.following)
      .filter((u): u is FollowUser => Boolean(u));
  }

   /**
    * Check if the current user is following another user
    * 
    */
  async isFollowing(userId: number): Promise<boolean> {
    const { data } = await api.get<
      ApiResponse<{ following: boolean }>
    >(`/follows/${userId}/is-following`);

    return data.data.following;
  }
}

export const followService = new FollowService();