import { useState } from "react";
import { Image as ImageIcon, Smile, MapPin, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/app/store";
import { usePosts } from "@/hooks/usePosts";

export function CreatePost() {
  const user = useAppStore((s) => s.user);
  const { createPost } = usePosts();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    await createPost(content.trim());
    setContent("");
    setSubmitting(false);
  };

  return (
    <Card className="rounded-2xl border-border/60 shadow-soft p-4">
      <div className="flex gap-3">
        <Avatar className="h-11 w-11 shrink-0">
          <AvatarImage src={user?.avatar_url ?? undefined} alt={user?.username ?? ""} />
          <AvatarFallback>{user?.username?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="min-h-[80px] resize-none border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0 placeholder:text-muted-foreground"
          />
          <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-3">
            <div className="flex items-center gap-1 text-primary">
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-primary/10">
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-primary/10">
                <Smile className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-primary/10">
                <Calendar className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-primary/10">
                <MapPin className="h-5 w-5" />
              </Button>
            </div>
            <Button
              onClick={submit}
              disabled={!content.trim() || submitting}
              className="rounded-full h-9 px-5 bg-gradient-primary text-primary-foreground font-semibold shadow-soft hover:shadow-hover hover:opacity-95"
            >
              {submitting ? "Posting…" : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
