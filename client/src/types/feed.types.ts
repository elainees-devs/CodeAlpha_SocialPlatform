// src/types/feed.types.ts
export type FeedUser = {
  id: number;
  username: string;
  avatar_url?: string;
};

export type FeedPost = {
  id: number;
  content: string;
  created_at: string;
  author: FeedUser;
  user: FeedUser;
  likes_count: number; // For backward compatibility, can be removed later
  comments_count: number; // For backward compatibility, can be removed later
  liked_by_me: boolean;

};

// Shape of API response from backend
export interface FeedResponse {
  success: boolean;
  message?: string;
  data: FeedPost[];
}