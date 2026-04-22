// src/pages/Feed.tsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Heart, MessageCircle } from "lucide-react";

import api from "../services/api";
import CreatePost from "../components/post/CreatePost";
import { FeedPost, FeedResponse } from "../types/feed.types";
import { useState } from "react";
import CommentModal from "../components/comment/CommentModal";

const fetchFeed = async (): Promise<FeedPost[]> => {
  const { data } = await api.get<FeedResponse>("/posts/feed");
  return data.data;
};

export default function Feed() {
  const queryClient = useQueryClient();

  // ======================
  // COMMENT MODAL STATE
  // ======================
  const [isCommentOpen, setIsCommentOpen] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  // ======================
  // FETCH FEED
  // ======================
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery<FeedPost[]>({
    queryKey: ["feed"],
    queryFn: fetchFeed,
    staleTime: 1000 * 60,
  });

  // ======================
  // LIKE MUTATION (OPTIMISTIC)
  // ======================
  const likeMutation = useMutation({
    mutationFn: async (postId: number) => {
      const { data } = await api.post(`/posts/${postId}/like`);
      return data.data; // { isLiked, likesCount }
    },

    onMutate: async (postId: number) => {
      await queryClient.cancelQueries({ queryKey: ["feed"] });

      const previousFeed = queryClient.getQueryData<FeedPost[]>(["feed"]);

      queryClient.setQueryData<FeedPost[]>(["feed"], (old) => {
        if (!old) return old;

        return old.map((post) => {
          if (post.id !== postId) return post;

          const isLiked = post.liked_by_me;

          return {
            ...post,
            liked_by_me: !isLiked,
            likes_count: isLiked
              ? Math.max(post.likes_count - 1, 0)
              : post.likes_count + 1,
          };
        });
      });

      return { previousFeed };
    },

    onError: (_err, _postId, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(["feed"], context.previousFeed);
      }
    },

    onSuccess: (data, postId) => {
      queryClient.setQueryData<FeedPost[]>(["feed"], (old) => {
        if (!old) return old;

        return old.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked_by_me: data.isLiked,
                likes_count: data.likesCount,
              }
            : post,
        );
      });
    },
  });

  // ======================
  // UI
  // ======================
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">Home Feed</h1>

      <CreatePost />

      {/* LOADING */}
      {isLoading && (
        <div className="text-gray-500 animate-pulse">Loading feed...</div>
      )}

      {/* ERROR */}
      {isError && (
        <div className="text-red-500">
          {(error as AxiosError<{ message: string }>).response?.data?.message ||
            "Failed to load feed"}
        </div>
      )}

      {/* POSTS */}
      <div className="space-y-4">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
          >
            {/* HEADER */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={
                  post.author.avatar_url
                    ? post.author.avatar_url.startsWith("http")
                      ? post.author.avatar_url
                      : `http://localhost:3000${post.author.avatar_url}`
                    : "https://via.placeholder.com/40"
                }
                className="w-10 h-10 rounded-full object-cover"
                alt="avatar"
              />

              <div>
                <p className="font-semibold text-sm">{post.author.username}</p>
                <p className="text-xs text-gray-400">
                  {new Date(post.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* CONTENT */}
            <p className="text-gray-800 text-sm mb-3">{post.content}</p>

            {/* ACTIONS */}
            <div className="flex items-center gap-6 text-sm text-gray-600 border-t pt-3">
              {/* LIKE */}
              <button
                onClick={() => likeMutation.mutate(post.id)}
                className="flex items-center gap-1"
              >
                <Heart
                  size={18}
                  className={
                    post.liked_by_me
                      ? "text-red-500 fill-red-500"
                      : "text-gray-600"
                  }
                />
                <span>{post.likes_count}</span>
              </button>

              {/* COMMENT */}
              <button
                onClick={() => {
                  setSelectedPostId(post.id);
                  setIsCommentOpen(true);
                }}
                className="flex items-center gap-1"
              >
                <MessageCircle size={18} />
                <span>{post.comments_count}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* COMMENT MODAL */}
      <CommentModal
        postId={selectedPostId}
        isOpen={isCommentOpen}
        onClose={() => {
          setIsCommentOpen(false);
          setSelectedPostId(null);
        }}
      />
    </div>
  );
}
