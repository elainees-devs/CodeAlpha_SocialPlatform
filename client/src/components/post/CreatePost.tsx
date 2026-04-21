// src/components/post/CreatePost.tsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";

export default function CreatePost() {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      return api.post("/posts", { content });
    },

    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-white">
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        rows={3}
      />

      <div className="flex justify-end mt-2">
        <button
          onClick={() => mutation.mutate()}
          disabled={!content.trim() || mutation.isPending}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
        >
          {mutation.isPending ? "Posting..." : "Post"}
        </button>
      </div>
      
    </div>
  );
}