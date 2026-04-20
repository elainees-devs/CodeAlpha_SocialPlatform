import { create, StateCreator } from "zustand";
import type { IPostResponse, UserProfileResponse } from "@/features/posts/types";
import { currentUser } from "@/features/posts/api/posts.api";

interface AppState {
  user: UserProfileResponse;
  posts: IPostResponse[];
  setPosts: (posts: IPostResponse[]) => void;
  addPost: (post: IPostResponse) => void;
  toggleLike: (id: number) => void;
}

const store: StateCreator<AppState> = (set) => ({
  user: currentUser,
  posts: [],
  setPosts: (posts) => set({ posts }),
  addPost: (post) =>
    set((s) => ({ posts: [post, ...s.posts] })),
  toggleLike: (id) =>
    set((s) => ({
      posts: s.posts.map((p) =>
        p.id === id
          ? {
              ...p,
              liked_by_me: !p.liked_by_me,
              likes_count: p.liked_by_me
                ? p.likes_count - 1
                : p.likes_count + 1,
            }
          : p,
      ),
    })),
});

export const useAppStore = create<AppState>(store);