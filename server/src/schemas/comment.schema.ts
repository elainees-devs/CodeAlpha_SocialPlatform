import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string()
    .transform((val) => val.trim())
    .pipe(
      z.string()
        .min(1, "Comment cannot be empty")
        .max(500, "Comment is too long (max 500 characters)")
    ),

  postId: z.coerce.number()
    .int()
    .positive()
    .min(1, "Post ID is required"),
});