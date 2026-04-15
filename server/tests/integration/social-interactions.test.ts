/// <reference types="jest" />
import { api } from "../helpers";
import { prisma } from "../../src/utils/prisma";

describe("Comments + Likes Integration", () => {
  let token: string;
  let userId: number;
  let postId: number;
  let commentId: number;

  const user = {
    username: "socialUser",
    email: "social@example.com",
    password: "Password123!",
  };

  beforeAll(async () => {
    await prisma.like.deleteMany({});
    await prisma.comment.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({
      where: { email: user.email },
    });

    // REGISTER
    await api.post("/api/auth/register").send(user);

    // LOGIN
    const login = await api.post("/api/auth/login").send({
      email: user.email,
      password: user.password,
    });


    token = login.body.token;


    // GET USER
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    userId = dbUser!.id;

    // CREATE POST
    const post = await prisma.post.create({
      data: {
        user_id: userId,
        content: "Social test post",
      },
    });

    postId = post.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });;

  // 2. LIKE POST TEST
  it("should like a post", async () => {
    const res = await api
      .post(`/api/likes/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Post liked");
  });

  // CHANGED: This is actually testing the "Toggle Off" feature
  it("should remove like when toggled again", async () => {
    const res = await api
      .post(`/api/likes/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Unliked post"); // Optional: check message
  });

  // 3. COMMENT ON POST TEST
    it("should create a comment on post", async () => {
    const res = await api
      .post("/api/comments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        post_id: postId,
        content: "This is a test comment",
      });

    expect(res.status).toBe(201);
    expect(res.body.data.content).toBe("This is a test comment");

    commentId = res.body.data.id;
  });

  it("should fetch comments for a post", async () => {
    const res = await api.get(`/api/comments/post/${postId}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  // 4. LIKE + COMMENT INTERACTION CHECK
  it("should reflect correct like + comment counts on post", async () => {
    // IMPORTANT: Since we toggled the like OFF in the previous test, 
    // we must toggle it back ON to see it in the final count.
    await api.post(`/api/likes/${postId}`).set("Authorization", `Bearer ${token}`);

    const res = await api.get(`/api/posts/${postId}`);

    expect(res.status).toBe(200);
    expect(res.body.data.likes_count).toBeGreaterThanOrEqual(1);
    expect(res.body.data.comments_count).toBeGreaterThanOrEqual(1);
  });
});

