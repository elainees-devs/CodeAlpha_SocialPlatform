// src/store/auth.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/user.types";

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;

  login: (user: User, token: string) => void;
  logout: () => void;
  setHydrated: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hydrated: false,

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null });
      },

      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "auth-storage",

      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
