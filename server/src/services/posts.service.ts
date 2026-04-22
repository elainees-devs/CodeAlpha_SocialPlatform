// src/services/posts.service.ts
import { prisma } from "../utils";
import type { IPostResponse } from "../types";

class PostService {
  // ======================
  // MAP POST → RESPONSE
  // ======================
  private mapPost(post: any, likedByMe: boolean = false): IPostResponse {
    return {
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      image_url: post.image_url ?? null,

      likes_count: post.likes_count,
      comments_count: post.comments_count,
      shares_count: post.shares_count ?? 0,

      created_at: post.created_at.toISOString(),
      updated_at: post.updated_at.toISOString(),

      liked_by_me: likedByMe,

      author: post.user
  ? {
      id: post.user.id,
      username: post.user.username,
      email: post.user.email,
      bio: post.user.bio,
      avatar_url: post.user.avatar_url ?? null,
      is_online: post.user.is_online,
      created_at: post.user.created_at.toISOString(),
      updated_at: post.user.updated_at.toISOString(),
    }
  : {
      id: 0,
      username: "deleted user",
      email: "",
      bio: null,
      avatar_url: null,
      is_online: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    };
  }

  // ======================
  // CREATE POST (FIXED)
  // ======================
  async create(data: {
    user_id: number;
    content: string;
    image_url?: string | null;
  }): Promise<IPostResponse> {
    const post = await prisma.post.create({
      data: {
        user_id: data.user_id,
        content: data.content,
        image_url: data.image_url,
      },
      include: {
        user: true,
      },
    });

    return this.mapPost(post);
  }

  // ======================
  // GET POST BY ID
  // ======================
  async findById(
    id: number,
    currentUserId?: number
  ): Promise<IPostResponse | null> {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!post) return null;

    let likedByMe = false;

    if (currentUserId) {
      const like = await prisma.like.findUnique({
        where: {
          user_id_post_id: {
            user_id: currentUserId,
            post_id: post.id,
          },
        },
        select: { id: true },
      });

      likedByMe = !!like;
    }

    return this.mapPost(post, likedByMe);
  }

  // ======================
  // FEED (OPTIMIZED)
  // ======================
 async getFeed(
  currentUserId?: number,
  page: number = 1,
  limit: number = 10
): Promise<{ posts: IPostResponse[]; total: number; totalPages: number }> {
  // 1. Calculate how many posts to skip
  const skip = (page - 1) * limit;

  // 2. Run count and findMany in parallel for better performance
  const [total, posts] = await Promise.all([
    prisma.post.count(),
    prisma.post.findMany({
  skip,
  take: limit,
  orderBy: { created_at: "desc" },
  include: {
    user: {
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        avatar_url: true,
        is_online: true,
        created_at: true,
        updated_at: true,
      },
    },
  },
}),
  ]); 

  // 3. Handle Like Logic
  let likedSet = new Set<number>();
  if (currentUserId) {
    const likes = await prisma.like.findMany({
      where: { user_id: currentUserId },
      select: { post_id: true },
    });
    likedSet = new Set(likes.map((l) => l.post_id));
  }

  // 4. Map results
  const mappedPosts = posts.map((p) => 
    this.mapPost(p, likedSet.has(p.id))
  );

  return {
    posts: mappedPosts,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

// ======================
  // ADD COMMENT (TRANSACTION)
  // ======================
  async addComment(data: {
    post_id: number;
    user_id: number;
    content: string;
  }) {
    // 1. Check if post exists first
    const post = await prisma.post.findUnique({
      where: { id: data.post_id },
      select: { id: true }
    });

    if (!post) throw new Error("Post not found");

    // 2. Create comment and increment counter in one transaction
    const [comment] = await prisma.$transaction([
      prisma.comment.create({
        data: {
          post_id: data.post_id,
          user_id: data.user_id,
          content: data.content,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar_url: true,
            },
          },
        },
      }),
      prisma.post.update({
        where: { id: data.post_id },
        data: {
          comments_count: { increment: 1 },
        },
      }),
    ]);

    return comment;
  }

  // ======================
  // USER POSTS
  // ======================
  async getUserPosts(userId: number): Promise<IPostResponse[]> {
    const posts = await prisma.post.findMany({
      where: { user_id: userId },
      include: {
        user: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return posts.map((p) => this.mapPost(p));
  }

  // ======================
  // DELETE POST (SAFE)
  // ======================
  async delete(postId: number, userId: number): Promise<boolean> {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { user_id: true },
    });

    if (!post || post.user_id !== userId) {
      throw new Error("Not authorized to delete this post");
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return true;
  }

  // ======================
  // LIKE POST (SAFE TRANSACTION)
  // ======================
  async like(postId: number, userId: number): Promise<void> {
    await prisma.$transaction([
      prisma.like.create({
        data: {
          user_id: userId,
          post_id: postId,
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: {
          likes_count: { increment: 1 },
        },
      }),
    ]);
  }

  // ======================
  // UNLIKE POST (SAFE)
  // ======================
  async unlike(postId: number, userId: number): Promise<void> {
    await prisma.$transaction([
      prisma.like.delete({
        where: {
          user_id_post_id: {
            user_id: userId,
            post_id: postId,
          },
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: {
          likes_count: { decrement: 1 },
        },
      }),
    ]);
  }

  // ======================
  // TOGGLE LIKE (SMART)
  // ======================
  async toggleLike(postId: number, userId: number): Promise<{ isLiked: boolean; likesCount: number }> {
    // 1. Check if the like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        user_id_post_id: {
          user_id: userId,
          post_id: postId,
        },
      },
    });

    let updatedPost;

    if (existingLike) {
      // 2. If it exists, UNLIKE (Delete like & decrement counter)
      [, updatedPost] = await prisma.$transaction([
        prisma.like.delete({
          where: {
            user_id_post_id: {
              user_id: userId,
              post_id: postId,
            },
          },
        }),
        prisma.post.update({
          where: { id: postId },
          data: { likes_count: { decrement: 1 } },
        }),
      ]);

      return { isLiked: false, likesCount: updatedPost.likes_count };
    } else {
      // 3. If it doesn't exist, LIKE (Create like & increment counter)
      try {
        [, updatedPost] = await prisma.$transaction([
          prisma.like.create({
            data: {
              user_id: userId,
              post_id: postId,
            },
          }),
          prisma.post.update({
            where: { id: postId },
            data: { likes_count: { increment: 1 } },
          }),
        ]);

        return { isLiked: true, likesCount: updatedPost.likes_count };
      } catch (error: any) {
        // Handle race condition if post was deleted or like was created simultaneously
        throw new Error("Could not update like status");
      }
    }
  }

  // ======================
  // COMMENT COUNTER
  // ======================
  async incrementComment(postId: number): Promise<void> {
    await prisma.post.update({
      where: { id: postId },
      data: {
        comments_count: { increment: 1 },
      },
    });
  }
}

export const postService = new PostService();