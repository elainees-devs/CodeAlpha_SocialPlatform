// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function ProtectedRoute() {
  const { isAuthenticated, hydrated } = useAuthStore();

  if (!hydrated) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}