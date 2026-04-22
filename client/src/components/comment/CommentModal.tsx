// src/components/comment/CommentModal.tsx
import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getCommentsByPost,
  createComment,
  Comment,
} from "../../services/comment.service";

// ======================
// TYPES
// ======================
interface Props {
  postId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CommentModal({
  postId,
  isOpen,
  onClose,
}: Props) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState<string>("");

  // ======================
  // FETCH COMMENTS (FIXED)
  // ======================
  const {
    data: comments = [],
    isLoading,
  } = useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsByPost(postId as number),
    enabled: isOpen && !!postId,
  });

  // ======================
  // ADD COMMENT (FIXED)
  // ======================
  const mutation = useMutation({
    mutationFn: () =>
      createComment(postId as number, content),

    onSuccess: (newComment: Comment) => {
      setContent("");

      // optimistic cache update
      queryClient.setQueryData<Comment[]>(
        ["comments", postId],
        (old) => {
          if (!old) return [newComment];
          return [newComment, ...old];
        }
      );

      // update feed (comment count)
      queryClient.invalidateQueries({
        queryKey: ["feed"],
      });
    },
  });

  if (!isOpen || !postId) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[500px] max-h-[80vh] rounded-lg p-4 flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Comments</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* COMMENTS */}
        <div className="flex-1 overflow-y-auto space-y-3 border p-2 rounded">
          {isLoading && (
            <p className="text-gray-500">Loading...</p>
          )}

          {comments.map((c) => (
            <div key={c.id} className="text-sm border-b pb-2">
              <p className="font-semibold">
                {c.author.username}
              </p>
              <p className="text-gray-700">
                {c.content}
              </p>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="mt-3 flex gap-2">
          <input
            className="flex-1 border rounded px-2 py-1 text-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
          />

          <button
            onClick={() => mutation.mutate()}
            disabled={
              !content.trim() || mutation.isPending
            }
            className="bg-purple-600 text-white px-3 rounded disabled:opacity-50"
          >
            {mutation.isPending
              ? "Posting..."
              : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}