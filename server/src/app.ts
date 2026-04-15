import express from "express";
import {
  authRoutes,
  userRoutes,
  postRoutes,
  commentRoutes,
  likeRoutes,
  followRoutes,
} from "./routes";

import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
 * Global error handler (MUST be the last middleware
 */
app.use(errorHandler);

export default app;