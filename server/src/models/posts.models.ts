import { Post } from "@prisma/client";
import { IPost, IPostResponse, CreatePostInput } from "../types";
import { prisma } from "../utils";

class PostModel {
  // ======================
  // Mapper
  // ======================
  private mapPost(prismaPost: Post & { _count?: { comments: number; likes: number } }): IPostResponse {
    return {
      id: prismaPost.id,
      user_id: prismaPost.user_id!,
      content: prismaPost.content,
      image_url: prismaPost.image_url ?? null,
      created_at: prismaPost.created_at.toISOString(),
      comments_count: prismaPost._count?.comments ?? 0,
      likes_count: prismaPost._count?.likes ?? 0,
    };
  }

  async create(data: CreatePostInput): Promise<IPostResponse> {
    const created = await prisma.post.create({
      data: {
        user_id: data.user_id,
        content: data.content,
        image_url: data.image_url,
      },
    });
    return this.mapPost(created);
  }

  async findById(id: number): Promise<IPostResponse | null> {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { _count: { select: { comments: true, likes: true } } },
    });
    return post ? this.mapPost(post) : null;
  }

  async findByUserId(user_id: number): Promise<IPostResponse[]> {
    const posts = await prisma.post.findMany({
      where: { user_id },
      include: { _count: { select: { comments: true, likes: true } } },
      orderBy: { created_at: "desc" },
    });
    return posts.map((post) => this.mapPost(post));
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await prisma.post.delete({ where: { id } });
    return !!deleted;
  }
}

export const postModel = new PostModel();