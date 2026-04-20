import { CreatePost } from "../components/CreatePost";
import { PostList } from "../components/PostList";

export function FeedPage() {
  return (
    <div className="space-y-4">
      <div className="sticky top-16 z-20 -mx-4 px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border/60">
        <h1 className="text-xl font-bold">Home</h1>
      </div>
      <CreatePost />
      <PostList />
    </div>
  );
}
