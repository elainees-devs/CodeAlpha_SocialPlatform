
/**
 * ======================
 * BASE
 * ======================
 */
export interface IBase {
  id: number;
  created_at: string;
}

/**
 * ======================
 * USER (matches Prisma User model)
 * ======================
 */
export interface IUser extends IBase {
  username: string;
  email: string;
  password_hash: string;
  bio?: string | null;
  avatar_url?: string | null;
  is_online: boolean; // Prisma default false
  updated_at: string;
}

/**
 * Safe API response (NEVER expose password_hash)
 */
export interface UserProfileResponse {
  id: number;
  username: string;
  email: string;
  bio?: string | null;
  avatar_url?: string | null;
  is_online: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * ======================
 * AUTH INPUTS
 * ======================
 */
export interface RegisterUserInput {
  username: string;
  email: string;
  password: string; // frontend sends raw password
  bio?: string | null;
  avatar_url?: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

/**
 * ======================
 * POST (matches Prisma Post model)
 * ======================
 */
export interface IPost extends IBase {
  user_id: number;

  content: string;
  image_url?: string | null;

  likes_count: number;
  comments_count: number;
  shares_count: number;

  updated_at: string;
}

/**
 * API Response for posts (what frontend uses)
 */
export interface IPostResponse extends IPost {
  author: UserProfileResponse;
  liked_by_me: boolean;
}

/**
 * ======================
 * COMMENT
 * ======================
 */
export interface IComment extends IBase {
  user_id: number;
  post_id: number;
  content: string;
}

/**
 * ======================
 * LIKE
 * ======================
 */
export interface ILike extends IBase {
  user_id: number;
  post_id: number;
}

/**
 * ======================
 * FOLLOW
 * ======================
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
export type CreatePostInput = {
  user_id: number;
  content: string;
  image_url?: string | null;
};

export type CreateCommentInput = {
  user_id: number;
  post_id: number;
  content: string;
};

export type CreateLikeInput = {
  user_id: number;
  post_id: number;
};

export type CreateFollowInput = {
  follower_id: number;
  following_id: number;
};

/**
 * ======================
 * RESPONSE WRAPPERS - what frontend uses
 * ======================
 */
export interface IFeedResponse {
  posts: IPostResponse[];
  page: number;
  pageSize: number;
  total: number;
}

export interface FollowResponse {
  following: boolean;
  data?: IFollow;
}

export interface ICommentResponse extends IBase {
  post_id: number;
  content: string;
  author: UserProfileResponse;
}