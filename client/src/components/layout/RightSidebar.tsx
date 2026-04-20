import { TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { suggestedUsers, trendingTopics } from "@/features/posts/api/posts.api";

export function RightSidebar() {
  return (
    <aside className="hidden lg:flex flex-col gap-4 sticky top-20 self-start">
      <Card className="rounded-2xl border-border/60 shadow-soft p-5">
        <h2 className="flex items-center gap-2 text-base font-semibold mb-4">
          <TrendingUp className="h-4 w-4 text-primary" />
          Trending now
        </h2>
        <ul className="space-y-3">
          {trendingTopics.map((t) => (
            <li
              key={t.tag}
              className="cursor-pointer rounded-lg -mx-2 px-2 py-1.5 transition hover:bg-muted"
            >
              <p className="text-sm font-semibold">{t.tag}</p>
              <p className="text-xs text-muted-foreground">{t.posts}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="rounded-2xl border-border/60 shadow-soft p-5">
        <h2 className="text-base font-semibold mb-4">Who to follow</h2>
        <ul className="space-y-4">
          {suggestedUsers.map((u) => (
            <li key={u.id} className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={u.avatar_url ?? undefined} alt={u.username} />
                <AvatarFallback>{u.username[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{u.username}</p>
                <p className="text-xs text-muted-foreground truncate">@{u.username}</p>
              </div>
              <Button size="sm" className="rounded-full h-8 px-4">
                Follow
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      <p className="px-2 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Pulse · Terms · Privacy
      </p>
    </aside>
  );
}
