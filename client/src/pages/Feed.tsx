// src/pages/Feed.tsx
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { FeedPost, FeedResponse } from "../types/feed.types";
import api from "../services/api";

export default function Feed() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const fetchFeed = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get<FeedResponse>("/posts/feed");

        if (isMounted) {
          setPosts(data.data);
        }
      } catch (err: unknown) {
        const error = err as AxiosError<{ message: string }>;

        if (isMounted) {
          setError(error.response?.data?.message || "Failed to load feed");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeed();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-lg flex">
        {/* FEED SECTION */}
        <div className="w-full md:w-3/4 p-6 border-r border-gray-100">
          <h1 className="text-2xl font-bold text-purple-700 mb-6">Home Feed</h1>

          {/* LOADING */}
          {loading && (
            <div className="text-gray-500 animate-pulse">Loading feed...</div>
          )}

          {/* ERROR */}
          {error && <div className="text-red-500">{error}</div>}

          {/* POSTS */}
          {!loading && !error && (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <p className="text-gray-500">No posts yet.</p>
              ) : (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
                  >
                    {/* USER HEADER */}
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={
                          post.author.avatar_url ||
                          "https://via.placeholder.com/40"
                        }
                        className="w-10 h-10 rounded-full object-cover"
                        alt="avatar"
                      />

                      <div>
                        <p className="font-semibold text-sm">
                          {post.author.username}
                        </p>

                        <p className="text-xs text-gray-400">
                          {new Date(post.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <p className="text-gray-800 text-sm">{post.content}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="hidden md:block w-1/4 p-6">
          <h2 className="text-lg font-semibold text-purple-700 mb-4">
            Suggestions
          </h2>

          <div className="space-y-3 text-sm text-gray-600">
            <p>👤 John Doe</p>
            <p>👤 Jane Smith</p>
            <p>👤 Alex Johnson</p>
          </div>
        </div>
      </div>
    </div>
  );
}
