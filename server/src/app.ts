import express from "express";
import cors from "cors";

import {
  authRoutes,
  userRoutes,
  postRoutes,
  commentRoutes,
  likeRoutes,
  followRoutes,
} from "./routes";

import { errorHandler } from "./middlewares";

const app = express();

app.use((req, _res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

/**
 * CORS
 */
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

/**
 * Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/follows", followRoutes);

/**
 * Health check
 */
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});

/**
 * Error handler
 */
app.use(errorHandler);

export default app;