// src/controllers/auth.controllers.ts
import { Request, Response } from "express";
import { authService } from "../services";
import { ApiError } from "../utils";

class AuthController {
  // ======================
  // REGISTER
  // ======================
  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error: any) {
      throw new ApiError(400, error.message);
    }
  }

  // ======================
  // LOGIN
  // ======================
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
      }

      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result.user,
        token: result.token,
      });
    } catch (error: any) {
      throw new ApiError(401, error.message);
    }
  }

  // ======================
  // GET CURRENT USER
  // ======================
  async me(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        throw new ApiError(401, "Unauthorized");
      }

      const user = await authService.me(userId);

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      throw new ApiError(400, error.message);
    }
  }

  // ======================
  // LOGOUT
  // ======================
  async logout(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        throw new ApiError(401, "Unauthorized");
      }

      const result = await authService.logout(userId);

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
        data: result,
      });
    } catch (error: any) {
      throw new ApiError(400, error.message);
    }
  }

  // ======================
  // VERIFY TOKEN (optional debug endpoint)
  // ======================
  async verifyToken(req: Request, res: Response) {
    try {
      const token =
        req.headers.authorization?.split(" ")[1] || req.body.token;

      if (!token) {
        throw new ApiError(400, "Token required");
      }

      const decoded = authService.verifyToken(token);

      res.status(200).json({
        success: true,
        data: decoded,
      });
    } catch (error: any) {
      throw new ApiError(401, "Invalid token");
    }
  }
}

export const authController = new AuthController();