// src/components/auth/AuthGate.tsx
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

export default function AuthGate() {
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const hydrated = useAuthStore((state) => state.hydrated);

  useEffect(() => {
    if (!hydrated) return;

    if (isAuthenticated) {
      navigate("/feed", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [hydrated, isAuthenticated, navigate]);

  if (!hydrated) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading session...
      </div>
    );
  }

  return <Outlet />;
}