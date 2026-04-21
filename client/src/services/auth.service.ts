import { AuthResponse, LoginInput, RegisterInput } from "../types/auth.types";
import api from "./api";


export const authService = {
  // POST /register
  register: async (userData: RegisterInput): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/register", userData);
    if (data.token) localStorage.setItem("token", data.token);
    return data;
  },

  // POST /login
  login: async (credentials: LoginInput) => {
    const { data } = await api.post("/auth/login", credentials);
    // Your controller sends token at the root of the response object
    if (data.token) localStorage.setItem("token", data.token);
    return data; // contains data.data (the user) and data.token
  },

  // GET /me
  getCurrentUser: async () => {
    const { data } = await api.get("/auth/me");
    return data.data;
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem("token");
  },
};
