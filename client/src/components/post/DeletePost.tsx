// src/components/post/DeletePost.tsx
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postService } from "../../services/post.service";
import { FeedPost } from "../../types/feed.types";

type Props = {
  postId: number;
  authorId: number;
  currentUserId?: number;
};

export default function DeletePost({
  postId,
  authorId,
  currentUserId,
}: Props) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => postService.deletePost(postId),

    // Optimistic update
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["feed"] });

      const previousFeed = queryClient.getQueryData<FeedPost[]>(["feed"]);

      queryClient.setQueryData<FeedPost[]>(["feed"], (old) => {
        if (!old) return old;
        return old.filter((post) => post.id !== postId);
      });

      return { previousFeed };
    },

    // Rollback if error
    onError: (_err, _variables, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(["feed"], context.previousFeed);
      }
    },

    // Refetch to sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  // Only show delete button if the user owns the post
  if (currentUserId !== authorId) return null;

  return (
    <button
      onClick={() => deleteMutation.mutate()}
      className="text-gray-400 hover:text-red-500 transition"
      title="Delete Post"
    >
      <Trash2 size={18} />
    </button>
  );
}