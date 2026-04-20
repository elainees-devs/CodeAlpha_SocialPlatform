import { createFileRoute } from "@tanstack/react-router";
import { HomeScreen } from "@/components/layout/HomeScreen";

export const Route = createFileRoute("/")({
  component: HomeScreen,
  head: () => ({
    meta: [
      { title: "Pulse — Modern social feed" },
      {
        name: "description",
        content:
          "Pulse is a modern social feed: share posts, follow trends, and connect — a clean blend of Twitter, Instagram, and Threads.",
      },
      { property: "og:title", content: "Pulse — Modern social feed" },
      {
        property: "og:description",
        content: "Share posts, follow trends, and connect on Pulse.",
      },
    ],
  }),
});
