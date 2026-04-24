// src/components/comment/DeleteCommentButton.tsx
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { commentService, Comment } from "../../services/comment.service";

type Props = {
  commentId: number;
  authorId: number;
  currentUserId?: number;
  postId: number;
};

export default function DeleteComment({
  commentId,
  authorId,
  currentUserId,
  postId,
}: Props) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => commentService.deleteComment(commentId),

    // Optimistic update
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["comments", postId],
      });

      const previousComments =
        queryClient.getQueryData<Comment[]>([
          "comments",
          postId,
        ]);

      queryClient.setQueryData<Comment[]>(
        ["comments", postId],
        (old) =>
          old?.filter((c) => c.id !== commentId) || []
      );

      return { previousComments };
    },

    // rollback if error
    onError: (_err, _vars, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", postId],
          context.previousComments
        );
      }
    },

    // sync with backend + update feed count
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });

      queryClient.invalidateQueries({
        queryKey: ["feed"],
      });
    },
  });

  // Only show delete button for owner
  if (currentUserId !== authorId) return null;

  return (
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className="text-gray-400 hover:text-red-500 transition"
      title="Delete comment"
    >
      <Trash2 size={16} />
    </button>
  );
}