/*
  Warnings:

  - Made the column `user_id` on table `comments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `post_id` on table `comments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `likes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `post_id` on table `likes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "follows_following_id_follower_id_idx";

-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "post_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "likes" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "post_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "comments_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shares_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "follows_follower_id_idx" ON "follows"("follower_id");

-- CreateIndex
CREATE INDEX "likes_user_id_idx" ON "likes"("user_id");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");
