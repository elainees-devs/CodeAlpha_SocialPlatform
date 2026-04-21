// src/routes/index.tsx
import { createBrowserRouter } from "react-router-dom";
import { Home, Login, Register } from "../pages";
import Feed from "../pages/Feed";
import AuthGate from "../components/auth/AuthGate";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";

export const router = createBrowserRouter([
  {
    element: <AuthGate />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },

      //Protected layout section
      {
        element: (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "/feed",
            element: <Feed />,
          },
        ],
      },
    ],
  },
]);