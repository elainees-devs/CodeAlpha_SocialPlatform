-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "posts_user_id_idx" ON "posts"("user_id");
