// src/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, hydrated } = useAuthStore();

  if (!hydrated) return null;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}