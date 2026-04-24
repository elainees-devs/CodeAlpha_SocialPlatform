import { AuthResponse, LoginInput, RegisterInput } from "../types/auth.types";
import api from "./api";

class AuthService {
  /**
   * POST /register
   */
  async register(userData: RegisterInput): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/register", userData);

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  }

  /**
   * POST /login
   */
  async login(credentials: LoginInput): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", credentials);

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  }

  /**
   * GET /auth/me
   */
  async getCurrentUser() {
    const { data } = await api.get("/auth/me");
    return data.data;
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem("token");
  }
}

export const authService = new AuthService();