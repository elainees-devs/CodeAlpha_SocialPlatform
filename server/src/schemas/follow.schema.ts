import { z } from "zod";

export const followSchema = z.object({
  followingId: z.coerce
    .number()
    .int()
    .positive()
    .min(1, "Target User ID is required"),
});