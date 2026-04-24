import api from "./api";

// ======================
// TYPES
// ======================
export type Comment = {
  id: number;
  content: string;
  postId: number;
  created_at: string;
  author: {
    id: number;
    username: string;
    avatar_url?: string | null;
  };
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

// ======================
// COMMENT SERVICE CLASS
// ======================
class CommentService {
  /**
   * Get comments for a post
   */
  async getCommentsByPost(postId: number): Promise<Comment[]> {
    const { data } = await api.get<ApiResponse<Comment[]>>(
      `/comments/post/${postId}`
    );

    return data.data;
  }

  /**
   * Create a comment
   */
  async createComment(
    postId: number,
    content: string
  ): Promise<Comment> {
    const { data } = await api.post<ApiResponse<Comment>>(
      "/comments",
      {
        postId,
        content,
      }
    );

    return data.data;
  }

  /**
   * Delete a comment (only owner)
   */
  async deleteComment(commentId: number): Promise<void> {
    await api.delete<ApiResponse<null>>(
      `/comments/${commentId}`
    );
  }
}

export const commentService = new CommentService();