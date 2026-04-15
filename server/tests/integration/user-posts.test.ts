/// <reference types="jest" />
import { api } from "../helpers";
import { prisma } from "../../src/utils/prisma";

describe("Users + Posts Integration", () => {
  const user = {
    username: "integrationUser",
    email: "integration@example.com",
    password: "Password123!",
  };

  let token: string;
  let userId: number;
  let postId: number;

  beforeAll(async () => {
    // clean DB
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({
      where: { email: user.email },
    });

    // register user
    await api.post("/api/auth/register").send(user);

    // login user
    const login = await api.post("/api/auth/login").send({
      email: user.email,
      password: user.password,
    });

    token = login.body.data?.token || login.body.token;

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    userId = dbUser!.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // TEST 1: USERS CAN CREATE POSTS
  it("user should create a post", async () => {
  const res = await api
    .post("/api/posts")
    .set("Authorization", `Bearer ${token}`)
    .send({
      content: "Integration test post",
    });

  expect(res.status).toBe(201);
  expect(res.body.data.content).toBe("Integration test post");

  postId = res.body.data.id;
});

// TEST 2: POST IS LINKED TO USER
it("post should be linked to correct user", async () => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  expect(post).toBeDefined();
  expect(post?.user_id).toBe(userId);
});

// TEST 3: USER CAN RETRIEVE THEIR POSTS
it("should fetch user posts", async () => {
  const res = await api.get("/api/posts");

  expect(res.status).toBe(200);
  expect(res.body.data.length).toBeGreaterThan(0);
});

// TEST 4: ANUTHORIZED USER CANNOT CREATE POST
it("should block post creation without token", async () => {
  const res = await api.post("/api/posts").send({
    content: "No auth post",
  });

  expect(res.status).toBe(401);
});
});