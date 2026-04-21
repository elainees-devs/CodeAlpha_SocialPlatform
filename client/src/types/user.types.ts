// src/types/user.types.ts
export type User = {
  id: string;
  name: string;
  email: string;
};

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  bio?: string;
  avatar_url?: string;
  is_online: boolean;
  created_at: string;
};