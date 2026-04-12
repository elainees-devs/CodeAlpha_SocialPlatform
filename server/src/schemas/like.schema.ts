import { z } from "zod";

export const toggleLikeSchema = z.object({
  postId: z.coerce.number()
  .int()
  .positive()
  .refine((val) => !isNaN(val), {
    message: "Post ID must be a valid number",
  }),
});

export type ToggleLikeInput = z.infer<typeof toggleLikeSchema>;