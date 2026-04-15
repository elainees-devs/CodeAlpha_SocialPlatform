import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // clear old data (optional for dev)
  await prisma.follow.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // create users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user1 = await prisma.user.create({
    data: {
      username: "alice",
      email: "alice@test.com",
      password_hash: hashedPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "bob",
      email: "bob@test.com",
      password_hash: hashedPassword,
    },
  });

  // create posts
  const post1 = await prisma.post.create({
    data: {
      content: "Hello world 🚀",
      user_id: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      content: "My second post 🔥",
      user_id: user2.id,
    },
  });

  // comments
  await prisma.comment.create({
    data: {
      content: "Nice post!",
      user_id: user2.id,
      post_id: post1.id,
    },
  });

  // likes
  await prisma.like.create({
    data: {
      user_id: user2.id,
      post_id: post1.id,
    },
  });

  // follow
  await prisma.follow.create({
    data: {
      follower_id: user1.id,
      following_id: user2.id,
    },
  });

  console.log("🌱 Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);

  })
  .finally(async () => {
    await prisma.$disconnect();
  });