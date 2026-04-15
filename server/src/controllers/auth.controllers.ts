import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils";
import { ApiError } from "../utils";

class AuthController {
  /**
   * Register user
   */
  async register(req: Request, res: Response) {
    const { username, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        created_at: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  }

  /**
   * Login user
   */
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  }

  /**
   * Get current user
   */
  async me(req: Request, res: Response) {
    const user_id = (req as any).user?.id;

    if (!user_id) {
      throw new ApiError(401, "Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { id: user_id },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        avatar_url: true,
        is_online: true,
        created_at: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }
}

export const authController = new AuthController();