import { api } from "../helpers";
import { prisma } from "../../src/utils/prisma";

describe("Likes API", () => {
  let token: string;
  let postId: number;
  let userId: number;

  const user = {
    username: "likeUser",
    email: "like@example.com",
    password: "Password123!",
  };

  beforeAll(async () => {
    // CLEAN DB
    await prisma.like.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({
      where: { email: user.email },
    });

    // REGISTER USER
    await api.post("/api/auth/register").send(user);

    // LOGIN USER
    const login = await api.post("/api/auth/login").send({
      email: user.email,
      password: user.password,
    });

    token = login.body.data?.token || login.body.token;

    // GET USER ID FROM DB
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    userId = dbUser!.id;

    // CREATE POST
    const post = await prisma.post.create({
      data: {
        user_id: userId,
        content: "Test post for likes",
      },
    });

    postId = post.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ======================
  // LIKE POST
  // ======================
  it("should like a post", async () => {
    const res = await api
      .post(`/api/likes/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Post liked");
  });

  // ======================
  // UNLIKE POST (TOGGLE)
  // ======================
  it("should unlike a post when liked again", async () => {
    const res = await api
      .post(`/api/likes/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Unliked post");
  });

  // ======================
  // UNAUTHORIZED REQUEST
  // ======================
  it("should block like without token", async () => {
    const res = await api.post(`/api/likes/${postId}`);

    expect(res.status).toBe(401);
  });

  // ======================
  // DB STATE CHECK
  // ======================
  it("should reflect correct like state in DB", async () => {
    const like = await prisma.like.findFirst({
      where: {
        user_id: userId,
        post_id: postId,
      },
    });

    // should be null because last action was "unlike"
    expect(like).toBeNull();
  });
});