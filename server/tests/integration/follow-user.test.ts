/// <reference types="jest" />
import { api } from "../helpers";
import { prisma } from "../../src/utils/prisma";

describe("Follows API", () => {
  let token: string;
  let userId: number;
  let targetUserId: number;

  const user = {
    username: "followerUser",
    email: "follower@example.com",
    password: "Password123!",
  };

  const targetUser = {
    username: "targetUser",
    email: "target@example.com",
    password: "Password123!",
  };

  beforeAll(async () => {
    await prisma.follow.deleteMany({});
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [user.email, targetUser.email],
        },
      },
    });

    await api.post("/api/auth/register").send(user);
    await api.post("/api/auth/register").send(targetUser);

    const login = await api.post("/api/auth/login").send({
      email: user.email,
      password: user.password,
    });

    token = login.body.data?.token || login.body.token;

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    const dbTarget = await prisma.user.findUnique({
      where: { email: targetUser.email },
    });

    userId = dbUser!.id;
    targetUserId = dbTarget!.id;
  });

  beforeEach(async () => {
    await prisma.follow.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ======================
  // FOLLOW USER
  // ======================
  it("should follow a user", async () => {
    const res = await api
      .post(`/api/follows/${targetUserId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.following).toBe(true);
  });

  // ======================
  // TOGGLE UNFOLLOW
  // ======================
  it("should unfollow user when followed again (toggle)", async () => {
    await api
      .post(`/api/follows/${targetUserId}`)
      .set("Authorization", `Bearer ${token}`);

    const res = await api
      .post(`/api/follows/${targetUserId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.following).toBe(false);
  });

  // ======================
  // BLOCK SELF FOLLOW
  // ======================
  it("should not allow user to follow themselves", async () => {
    const res = await api
      .post(`/api/follows/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
  });

  // ======================
  // UNAUTHORIZED REQUEST
  // ======================
  it("should block follow without token", async () => {
    const res = await api.post(`/api/follows/${targetUserId}`);

    expect(res.status).toBe(401);
  });

  // ======================
  // DB STATE CHECK
  // ======================
  it("should reflect correct follow state in DB", async () => {
    await api
      .post(`/api/follows/${targetUserId}`)
      .set("Authorization", `Bearer ${token}`);

    await api
      .post(`/api/follows/${targetUserId}`)
      .set("Authorization", `Bearer ${token}`);

    const follow = await prisma.follow.findFirst({
      where: {
        follower_id: userId,
        following_id: targetUserId,
      },
    });

    expect(follow).toBeNull();
  });

  // ======================
  // FOLLOW COUNTS TEST
  // ======================
  it("should correctly count followers and following", async () => {
    await api
      .post(`/api/follows/${targetUserId}`)
      .set("Authorization", `Bearer ${token}`);

    const followersCount = await prisma.follow.count({
      where: { following_id: targetUserId },
    });

    const followingCount = await prisma.follow.count({
      where: { follower_id: userId },
    });

    expect(followersCount).toBe(1);
    expect(followingCount).toBe(1);
  });

  // ======================
  // TOGGLE COUNTS BACK TO ZERO
  // ======================
  it("should update counts after unfollow (toggle)", async () => {
    await api
      .post(`/api/follows/${targetUserId}`)
      .set("Authorization", `Bearer ${token}`);

    await api
      .post(`/api/follows/${targetUserId}`)
      .set("Authorization", `Bearer ${token}`);

    const followersCount = await prisma.follow.count({
      where: { following_id: targetUserId },
    });

    const followingCount = await prisma.follow.count({
      where: { follower_id: userId },
    });

    expect(followersCount).toBe(0);
    expect(followingCount).toBe(0);
  });
});