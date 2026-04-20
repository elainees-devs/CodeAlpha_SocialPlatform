import {
  Bell,
  Bookmark,
  Compass,
  Home,
  Mail,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const items = [
  { label: "Home", icon: Home, active: true },
  { label: "Explore", icon: Compass },
  { label: "Notifications", icon: Bell },
  { label: "Messages", icon: Mail },
  { label: "Bookmarks", icon: Bookmark },
  { label: "Profile", icon: UserIcon },
  { label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden md:block sticky top-20 self-start">
      <nav className="flex flex-col gap-1">
        {items.map((it) => (
          <Button
            key={it.label}
            variant="ghost"
            className={cn(
              "justify-start gap-4 rounded-full px-4 h-12 text-base font-medium",
              it.active && "bg-muted text-foreground",
            )}
          >
            <it.icon className="h-5 w-5" />
            <span>{it.label}</span>
          </Button>
        ))}
        <Button className="mt-4 h-12 rounded-full bg-gradient-primary text-primary-foreground font-semibold shadow-soft hover:shadow-hover hover:opacity-95 transition">
          Post
        </Button>
      </nav>
    </aside>
  );
}
