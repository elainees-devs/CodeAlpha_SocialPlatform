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

// ======================
// GET COMMENTS FOR POST
// ======================
export const getCommentsByPost = async (
  postId: number
): Promise<Comment[]> => {
  const { data } = await api.get(
    `/comments/post/${postId}`
  );

  return data.data;
};

// ======================
// CREATE COMMENT
// ======================
export const createComment = async (
  postId: number,
  content: string
): Promise<Comment> => {
  const { data } = await api.post("/comments", {
    postId,
    content,
  });

  return data.data;
};

// ======================
// DELETE COMMENT
// ======================
export const deleteComment = async (
  commentId: number
): Promise<{ success: boolean }> => {
  const { data } = await api.delete(
    `/comments/${commentId}`
  );

  return data;
};