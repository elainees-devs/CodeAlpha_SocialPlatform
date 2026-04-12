import { z } from 'zod';

export const createPostSchema = z.object({
  content: z.string()
    .min(1, "Post cannot be empty")
    .max(280, "Post exceeds 280 character limit"), // Classic Twitter-style limit
  
  media_url: z.string()
    .url("Invalid media URL")
    .optional()
    .nullable(),
  
  location: z.string()
    .max(100, "Location name too long")
    .optional(),
});

/**
 * Update Post Schema
 * Users can update content or media, but the rules remain the same.
 */
export const updatePostSchema = createPostSchema.partial();

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;