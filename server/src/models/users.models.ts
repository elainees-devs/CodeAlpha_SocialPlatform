import { User } from "@prisma/client";
import { IUser, RegisterUserInput, UserProfileResponse } from "../types";
import { prisma } from "../utils";

/**
 * User Model (Prisma + Mapper Pattern)
 */
class UserModel {
  // ======================
  // Mapper (Prisma → Interface)
  // ======================
  private mapUser(prismaUser: User): IUser {
    return {
      id: prismaUser.id,
      username: prismaUser.username,
      email: prismaUser.email,
      password_hash: prismaUser.password_hash,
      bio: prismaUser.bio ?? null,
      avatar_url: prismaUser.avatar_url ?? null,
      is_online: prismaUser.is_online,
      created_at: prismaUser.created_at.toISOString(),
    };
  }

  private mapUserProfile(prismaUser: User): UserProfileResponse {
    return {
      id: prismaUser.id,
      username: prismaUser.username,
      email: prismaUser.email,
      bio: prismaUser.bio ?? null,
      avatar_url: prismaUser.avatar_url ?? null,
      is_online: prismaUser.is_online,
      created_at: prismaUser.created_at.toISOString(),
    };
  }

  // ======================
  // Create User
  // ======================
  async create(data: RegisterUserInput): Promise<IUser> {
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
        password_hash: data.password_hash,
        bio: data.bio,
        avatar_url: data.avatar_url,
        is_online: data.is_online ?? false,
      },
    });

    return this.mapUser(created);
  }

  // ======================
  // Find By ID
  // ======================
  async findById(id: number): Promise<UserProfileResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user ? this.mapUserProfile(user) : null;
  }

  // ======================
  // Find By Email
  // ======================
  async findByEmail(email: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user ? this.mapUser(user) : null;
  }

  // ======================
  // Find By Username
  // ======================
  async findByUsername(username: string): Promise<IUser | null> {
    const user = await prisma.user.findFirst({
      where: { username },
    });

    return user ? this.mapUser(user) : null;
  }

  // ======================
  // Get All Users
  // ======================
  async findAll(): Promise<UserProfileResponse[]> {
    const users = await prisma.user.findMany({
      orderBy: { created_at: "desc" },
    });

    return users.map((user) => this.mapUserProfile(user));
  }

  // ======================
  // Update Profile
  // ======================
  async updateProfile(
    id: number,
    data: Partial<Omit<IUser, "id" | "created_at">>,
  ): Promise<UserProfileResponse | null> {
    const updated = await prisma.user.update({
      where: { id },
      data,
    });

    return updated ? this.mapUserProfile(updated) : null;
  }

  // ======================
  // Delete User
  // ======================
  async delete(id: number): Promise<boolean> {
    const deleted = await prisma.user.delete({
      where: { id },
    });

    return !!deleted;
  }

  // ======================
  // Toggle Online Status
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

export const userModel = new UserModel();
