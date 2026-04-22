// src/services/auth.service.ts
import { prisma } from "../utils";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { RegisterUserInput, UserProfileResponse } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

class AuthService {
  // ======================
  // MAP USER → SAFE RESPONSE
  // ======================
  private mapUser(user: any): UserProfileResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      avatar_url: user.avatar_url,
      is_online: user.is_online,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    };
  }

  // ======================
  // REGISTER
  // ======================
  async register(data: RegisterUserInput): Promise<UserProfileResponse> {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password_hash: hashedPassword,
        bio: data.bio,
        avatar_url: data.avatar_url,
        is_online: true,
      },
    });

    return this.mapUser(user);
  }

  // ======================
  // LOGIN
  // ======================
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
    throw new Error( "Invalid email");
  }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // mark online
    await prisma.user.update({
      where: { id: user.id },
      data: { is_online: true },
    });

    return {
      user: this.mapUser(user),
      token,
    };
  }

  // ======================
  // GET CURRENT USER
  // ======================
  async me(userId: number): Promise<UserProfileResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return user ? this.mapUser(user) : null;
  }

  // ======================
  // LOGOUT
  // ======================
  async logout(userId: number) {
    await prisma.user.update({
      where: { id: userId },
      data: { is_online: false },
    });

    return { success: true };
  }

  // ======================
  // VERIFY TOKEN
  // ======================
  verifyToken(token: string): { userId: number; email: string } {
    return jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
    };
  }
}

export const authService = new AuthService();