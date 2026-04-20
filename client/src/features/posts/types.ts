/**
 * Base Entity
 */
export interface IBase {
  id: number;
  created_at: string;
}

/**
 * User Entity (internal DB shape)
 */
export interface IUser extends IBase {
  username: string;
  email: string;
  password_hash: string;
  bio?: string | null;
  avatar_url?: string | null;
  is_online?: boolean;
}

/**
 * Public User Response (SAFE for frontend/API)
 */
export type UserProfileResponse = Omit<IUser, "password_hash">;

/**
 * Register Input
 * - frontend sends plain password
 * - backend will hash it
 */
export interface RegisterUserInput {
  username: string;
  email: string;
  password_hash: string;
  bio?: string | null;
  avatar_url?: string | null;
  is_online?: boolean;
}

/**
 * Post Entity
 */
export interface IPost extends IBase {
  user_id: number;
  content: string;
  image_url?: string | null;
}

/**
 * Post Response (with counts + embedded author for feed rendering)
 */
export interface IPostResponse extends IPost {
  comments_count: number;
  likes_count: number;
  shares_count?: number;
  author: UserProfileResponse;
  liked_by_me?: boolean;
}

/**
 * Comment Entity
 */
export interface IComment extends IBase {
  user_id: number;
  post_id: number;
  content: string;
}

/**
 * Like Entity
 */
export interface ILike extends IBase {
  user_id: number;
  post_id: number;
}

/**
 * Follow Entity
 */
export interface IFollow extends IBase {
  follower_id: number;
  following_id: number;
}

/**
 * ======================
 * INPUT TYPES
 * ======================
 */
export type CreatePostInput = Omit<IPost, "id" | "created_at">;
export type CreateCommentInput = Omit<IComment, "id" | "created_at">;
export type CreateLikeInput = Omit<ILike, "id" | "created_at">;
export type CreateFollowInput = Omit<IFollow, "id" | "created_at">;
