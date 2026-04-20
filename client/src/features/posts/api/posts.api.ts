import type {
  CreatePostInput,
  IPostResponse,
  UserProfileResponse,
} from "./../types";

const users: UserProfileResponse[] = [
  {
    id: 1,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
    username: "avachen",
    email: "ava@pulse.app",
    bio: "Design systems & color nerd",
    avatar_url: "https://i.pravatar.cc/150?img=47",
    is_online: true,
  },
  {
    id: 2,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    username: "marcusr",
    email: "marcus@pulse.app",
    bio: "Notebook addict",
    avatar_url: "https://i.pravatar.cc/150?img=12",
    is_online: false,
  },
  {
    id: 3,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    username: "sofiap",
    email: "sofia@pulse.app",
    bio: "Runner & builder",
    avatar_url: "https://i.pravatar.cc/150?img=32",
    is_online: true,
  },
  {
    id: 4,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    username: "liamw",
    email: "liam@pulse.app",
    bio: "UX engineer",
    avatar_url: "https://i.pravatar.cc/150?img=15",
    is_online: false,
  },
  {
    id: 5,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    username: "noora",
    email: "noor@pulse.app",
    bio: "Tiny weekend things",
    avatar_url: "https://i.pravatar.cc/150?img=49",
    is_online: true,
  },
];

const mockPosts: IPostResponse[] = [
  {
    id: 1,
    user_id: 1,
    author: users[0],
    content:
      "Just shipped a new design system at work ✨ Loving how oklch makes color theming feel effortless. What's your favorite color space?",
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    likes_count: 124,
    comments_count: 18,
    shares_count: 4,
    image_url:
      "https://images.unsplash.com/photo-1529119513315-c7c361862fc7?w=1200&auto=format&fit=crop&q=70",
  },
  {
    id: 2,
    user_id: 2,
    author: users[1],
    content:
      "Morning coffee + a fresh notebook. Best part of any new project is the empty page.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    likes_count: 88,
    comments_count: 9,
    shares_count: 2,
    image_url: null,
  },
  {
    id: 3,
    user_id: 3,
    author: users[2],
    content: "Sunset run done 🏃‍♀️ — 5k under 25 min. Small wins.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    likes_count: 312,
    comments_count: 41,
    shares_count: 11,
    image_url:
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&auto=format&fit=crop&q=70",
  },
  {
    id: 4,
    user_id: 4,
    author: users[3],
    content:
      "Hot take: skeleton loaders > spinners 99% of the time. Perceived performance matters.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    likes_count: 567,
    comments_count: 102,
    shares_count: 33,
    image_url: null,
  },
  {
    id: 5,
    user_id: 5,
    author: users[4],
    content: "Weekend plans: build something tiny and useless and beautiful.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    likes_count: 201,
    comments_count: 14,
    shares_count: 6,
    image_url:
      "https://images.unsplash.com/photo-1496180470114-6ef490f3ff22?w=1200&auto=format&fit=crop&q=70",
  },
];

export async function fetchPosts(): Promise<IPostResponse[]> {
  await new Promise((r) => setTimeout(r, 600));
  return mockPosts;
}

export async function createPostApi(input: CreatePostInput): Promise<IPostResponse> {
  await new Promise((r) => setTimeout(r, 300));
  const author = users.find((u) => u.id === input.user_id) ?? users[0];
  return {
    id: Date.now(),
    user_id: input.user_id,
    author,
    content: input.content,
    image_url: input.image_url ?? null,
    created_at: new Date().toISOString(),
    likes_count: 0,
    comments_count: 0,
    shares_count: 0,
  };
}

export const currentUser: UserProfileResponse = users[0];
export const suggestedUsers: UserProfileResponse[] = users.slice(1, 4);
export const trendingTopics = [
  { tag: "#DesignSystems", posts: "12.4k posts" },
  { tag: "#TypeScript", posts: "8.9k posts" },
  { tag: "#Tailwind", posts: "21.1k posts" },
  { tag: "#IndieHackers", posts: "5.2k posts" },
];
