import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";
import { Feed, Home, Login,Profile, Register } from "../pages";
import NotFound from "../components/shared/NotFound";

export const router = createBrowserRouter([
  // PUBLIC ROUTES
  {
    path: "/",
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "home", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },

  // PROTECTED ROUTES ONLY
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "feed", element: <Feed /> },
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },

  // GLOBAL NOT FOUND
  {
    path: "*",
    element: <NotFound />,
  },
]);