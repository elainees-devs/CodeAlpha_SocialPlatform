import api from "../services/api";

export const toggleLike = async (postId: number) => {
  const { data } = await api.post(`/posts/${postId}/like`);
  return data;
};