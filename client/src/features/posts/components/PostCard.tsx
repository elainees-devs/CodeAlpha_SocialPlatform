import { useState } from "react";
import { Heart, MessageCircle, MoreHorizontal, Repeat2, Share } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/app/store";
import { formatRelativeTime } from "@/utils/formatDate";
import { cn } from "@/lib/utils";
import type { IPostResponse } from "../types";

export function PostCard({ post }: { post: IPostResponse }) {
  const toggleLike = useAppStore((s) => s.toggleLike);
  const [animate, setAnimate] = useState(false);

  const handleLike = () => {
    if (!post.liked_by_me) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 400);
    }
    toggleLike(post.id);
  };

  const displayName = post.author.username;
  const avatarUrl = post.author.avatar_url ?? undefined;

  return (
    <Card className="group rounded-2xl border-border/60 shadow-soft p-5 transition-all duration-200 hover:shadow-hover hover:border-border">
      <div className="flex gap-3">
        <Avatar className="h-11 w-11 shrink-0">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-semibold truncate">{displayName}</span>
            <span className="text-muted-foreground truncate">@{post.author.username}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{formatRelativeTime(post.created_at)}</span>
            <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <p className="mt-1 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {post.content}
          </p>

          {post.image_url && (
            <div className="mt-3 overflow-hidden rounded-xl border border-border/60">
              <img
                src={post.image_url}
                alt=""
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          )}

          <div className="mt-3 flex items-center justify-between max-w-md text-muted-foreground">
            <ActionButton icon={MessageCircle} count={post.comments_count} hoverColor="hover:text-primary hover:bg-primary/10" />
            <ActionButton icon={Repeat2} count={post.shares_count} hoverColor="hover:text-emerald-500 hover:bg-emerald-500/10" />
            <button
              onClick={handleLike}
              className={cn(
                "group/like flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm transition",
                "hover:text-rose-500 hover:bg-rose-500/10",
                post.liked_by_me && "text-rose-500",
              )}
            >
              <Heart
                className={cn("h-[18px] w-[18px]", post.liked_by_me && "fill-current", animate && "animate-like")}
              />
              <span className="tabular-nums">{post.likes_count}</span>
            </button>
            <ActionButton icon={Share} hoverColor="hover:text-primary hover:bg-primary/10" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function ActionButton({
  icon: Icon,
  count,
  hoverColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  hoverColor: string;
}) {
  return (
    <button className={cn("flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm transition", hoverColor)}>
      <Icon className="h-[18px] w-[18px]" />
      {count !== undefined && <span className="tabular-nums">{count}</span>}
    </button>
  );
}
