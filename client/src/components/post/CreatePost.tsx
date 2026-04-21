// src/components/post/CreatePost.tsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";

export default function CreatePost() {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      console.log("🔥 Creating post:", content);

      const { data } = await api.post("/posts", { content });

      console.log("🔥 Response:", data);

      return data;
    },

    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },

    onError: (err) => {
      console.log("❌ Error creating post:", err);
    },
  });

  return (
    <div className="border rounded-lg p-4 mb-6 bg-white">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full border p-2 rounded"
        rows={3}
      />

      <div className="flex justify-end mt-2">
        <button
          onClick={() => mutation.mutate()}
          disabled={!content.trim() || mutation.isPending}
          className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {mutation.isPending ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}