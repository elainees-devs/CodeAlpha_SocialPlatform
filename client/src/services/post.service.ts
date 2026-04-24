// src/services/post.service.ts
import api from "../services/api";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

class PostService {
  /**
   * Toggle like on a post
   */
  async toggleLike(postId: number) {
    const { data } = await api.post(`/posts/${postId}/like`);
    return data;
  }

  /**
   * Delete post (only owner)
   */
  async deletePost(postId: number): Promise<void> {
    await api.delete<ApiResponse<null>>(`/posts/${postId}`);
  }
}

export const postService = new PostService();