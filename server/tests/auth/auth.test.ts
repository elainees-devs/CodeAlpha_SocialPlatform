/// <reference types="jest" />
import { api } from "../helpers";
import { prisma } from "../../src/utils/prisma";

describe("Auth API", () => {
  const testUser = {
    username: "testuser",
    email: "test@example.com",
    password: "Password123!",
  };

  beforeAll(async () => {
    // clean database before tests
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ======================
  // REGISTER TEST
  // ======================
  it("should register a new user", async () => {
    const res = await api.post("/api/auth/register").send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testUser.email);
  });

  // ======================
  // LOGIN TEST
  // ======================
  it("should login user and return token", async () => {
    const res = await api.post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  // ======================
  // PROTECTED ROUTE TEST
  // ======================
  it("should reject access without token", async () => {
    const res = await api.get("/api/users/me");

    expect(res.status).toBe(401);
  });

  it("should allow access with token", async () => {
    const loginRes = await api.post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    const token = loginRes.body.token;

    const res = await api
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(testUser.email);
  });
});