// src/services/users.service.ts
import type { IUser, RegisterUserInput, UserProfileResponse } from "../types";

import { prisma } from "../utils";

class UserService {
  // ======================
  // MAP USER → FULL INTERNAL
  // ======================
  private mapUser(user: any): IUser {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      password_hash: user.password_hash,
      bio: user.bio ?? null,
      avatar_url: user.avatar_url ?? null,
      is_online: user.is_online,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    };
  }

  // ======================
  // MAP USER → SAFE RESPONSE
  // ======================
  private mapUserProfile(user: any): UserProfileResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio ?? null,
      avatar_url: user.avatar_url ?? null,
      is_online: user.is_online,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    };
  }

  // ======================
  // CREATE USER
  // ======================
  async createUser(data: RegisterUserInput): Promise<IUser> {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new Error("User already exists with this email");
    }

    const created = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password_hash: data.password, // IMPORTANT FIX (frontend sends password)
        bio: data.bio,
        avatar_url: data.avatar_url,
        is_online: false,
      },
    });

    return this.mapUser(created);
  }

  // ======================
  // FIND BY ID
  // ======================
  async findUserById(id: number): Promise<UserProfileResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user ? this.mapUserProfile(user) : null;
  }

  // ======================
  // FIND BY EMAIL
  // ======================
  async findUserByEmail(email: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user ? this.mapUser(user) : null;
  }

  // ======================
  // FIND BY USERNAME
  // ======================
  async findUserByUsername(username: string): Promise<IUser | null> {
    const user = await prisma.user.findFirst({
      where: { username },
    });

    return user ? this.mapUser(user) : null;
  }

  // ======================
  // GET ALL USERS
  // ======================
  async findAllUsers(): Promise<UserProfileResponse[]> {
    const users = await prisma.user.findMany({
      orderBy: { created_at: "desc" },
    });

    return users.map((u) => this.mapUserProfile(u));
  }

// ======================
// UPDATE PROFILE (SAFE)
// ======================
async updateProfile(
  id: number,
  data: {
    username?: string;
    bio?: string | null;
    avatar_url?: string | null;
  },
): Promise<UserProfileResponse> {

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(data.username !== undefined && { username: data.username }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.avatar_url !== undefined && { avatar_url: data.avatar_url }),
    },
  });

  return this.mapUserProfile(updated);
}

  // ======================
  // DELETE USER
  // ======================
  async deleteUser(id: number): Promise<boolean> {
    await prisma.user.delete({
      where: { id },
    });

    return true;
  }

  // ======================
  // TOGGLE ONLINE STATUS
  // ======================
  async toggleStatus(id: number): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { is_online: true },
    });

    if (!user) throw new Error("User not found");

    const updated = await prisma.user.update({
      where: { id },
      data: { is_online: !user.is_online },
      select: { is_online: true },
    });

    return updated.is_online;
  }
}

export const userService = new UserService();
