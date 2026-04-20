import { Plus } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { FeedPage } from "@/features/posts/pages/FeedPage";
import { Button } from "@/components/ui/button";

export function HomeScreen() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="mx-auto max-w-7xl grid grid-cols-12 gap-6 px-4 py-6">
        <div className="col-span-12 md:col-span-3 lg:col-span-3">
          <Sidebar />
        </div>
        <main className="col-span-12 md:col-span-9 lg:col-span-6">
          <FeedPage />
        </main>
        <div className="col-span-12 lg:col-span-3">
          <RightSidebar />
        </div>
      </div>

      <Button
        size="icon"
        className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-primary text-primary-foreground shadow-hover hover:opacity-95"
        aria-label="New post"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
