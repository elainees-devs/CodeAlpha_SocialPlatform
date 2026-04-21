// src/routes/index.tsx
import { createBrowserRouter } from "react-router-dom";
import { Home, Login, Profile, Register } from "../pages";
import Feed from "../pages/Feed";
import AuthGate from "../components/auth/AuthGate";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";

export const router = createBrowserRouter([
  {
    element: <AuthGate />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },

      {
        element: <ProtectedRoute />, 
        children: [
          {
            element: <AppLayout />,  
            children: [
              { path: "/feed", element: <Feed /> },
              { path: "/profile", element: <Profile /> }
            ],
          },
        ],
      },
    ],
  },
]);