import { useEffect, useState } from "react";
import Loader from "@/components/shared/Loader";
import { CreatePost } from "../components/CreatePost";
import { PostList } from "../components/PostList";

export function FeedPage() {
  const [loading, setLoading] = useState(true);

  // Simulate API call (replace with real fetch / redux / react-query)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="sticky top-16 z-20 -mx-4 px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border/60">
        <h1 className="text-xl font-bold">Home</h1>
      </div>

      {/* Create Post always visible */}
      <CreatePost />

      {/* Feed content */}
      {loading ? (
        <Loader text="Loading feed..." />
      ) : (
        <PostList />
      )}
    </div>
  );
}