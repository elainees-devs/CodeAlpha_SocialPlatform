import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { usePosts } from "@/hooks/usePosts";
import { PostCard } from "./PostCard";

export function PostList() {
  const { posts, loading } = usePosts();

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="rounded-2xl border-border/60 shadow-soft p-5">
            <div className="flex gap-3">
              <Skeleton className="h-11 w-11 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-40 w-full rounded-xl" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="rounded-2xl border-border/60 shadow-soft p-10 text-center">
        <p className="text-base font-semibold">No posts yet</p>
        <p className="mt-1 text-sm text-muted-foreground">Be the first to share something.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}
