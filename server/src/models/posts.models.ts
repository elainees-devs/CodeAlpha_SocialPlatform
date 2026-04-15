import { IPostResponse, CreatePostInput } from "../types";
import { prisma } from "../utils";

type PostWithCounts = {
  id: number;
  user_id: number | null;
  content: string;
  image_url: string | null;
  created_at: Date;
  _count: {
    comments: number;
    likes: number;
  };
};

class PostModel {
  // ======================
  // Mapper
  // ======================
  private mapPost(prismaPost: PostWithCounts): IPostResponse {
    return {
      id: prismaPost.id,
      user_id: prismaPost.user_id!,
      content: prismaPost.content,
      image_url: prismaPost.image_url ?? null,
      created_at: prismaPost.created_at.toISOString(),
      comments_count: prismaPost._count.comments,
      likes_count: prismaPost._count.likes,
    };
  }

  // ======================
  // CREATE POST
  // ======================
  async create(data: CreatePostInput): Promise<IPostResponse> {
    const created = await prisma.post.create({
      data: {
        user_id: data.user_id,
        content: data.content,
        image_url: data.image_url,
      },
      include: {
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return this.mapPost(created);
  }

  // ======================
  // GET POST BY ID
  // ======================
  async findById(id: number): Promise<IPostResponse | null> {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return post ? this.mapPost(post) : null;
  }

  // ======================
  // GET POSTS BY USER
  // ======================
  async findByUserId(user_id: number): Promise<IPostResponse[]> {
    const posts: PostWithCounts[] = await prisma.post.findMany({
      where: { user_id },
      include: {
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return posts.map((post) => this.mapPost(post));
  }

  // ======================
  // GET ALL POSTS
  // ======================
  async getAllPosts(): Promise<IPostResponse[]> {
    const posts: PostWithCounts[] = await prisma.post.findMany({
      include: {
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return posts.map((post) => this.mapPost(post));
  }

  // ======================
  // DELETE POST
  // ======================
  async delete(id: number): Promise<boolean> {
    await prisma.post.delete({ where: { id } });
    return true;
  }
}

export const postModel = new PostModel();
