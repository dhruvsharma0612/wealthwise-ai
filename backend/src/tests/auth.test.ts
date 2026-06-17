import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "../services/prisma";
import app from "./app";

const USER = {
  email:     "auth@ww-test.dev",
  password:  "Test1234!",
  firstName: "Auth",
  lastName:  "Test",
  currency:  "INR",
};

let accessToken  = "";
let refreshToken = "";

async function cleanAuth() {
  await prisma.refreshToken.deleteMany({ where: { user: { email: USER.email } } });
  await prisma.user.deleteMany({ where: { email: USER.email } });
}

beforeAll(async () => { await cleanAuth(); });
afterAll(async () => { await cleanAuth(); await prisma.$disconnect(); });

describe("Auth", () => {

  describe("POST /api/auth/signup", () => {
    it("creates a new user and returns tokens", async () => {
      const res = await request(app).post("/api/auth/signup").send(USER);
      expect(res.status).toBe(201);
      expect(res.body.user.email).toBe(USER.email);
      expect(res.body.user.plan).toBe("FREE");
      expect(res.body.accessToken).toBeTruthy();
      expect(res.body.refreshToken).toBeTruthy();
      accessToken  = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });

    it("rejects duplicate email with 409", async () => {
      const res = await request(app).post("/api/auth/signup").send(USER);
      expect(res.status).toBe(409);
      expect(res.body.code).toBe("EMAIL_EXISTS");
    });

    it("rejects missing fields with 400", async () => {
      const res = await request(app).post("/api/auth/signup").send({ email: "x@x.com" });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("returns tokens on valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: USER.email, password: USER.password,
      });
      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeTruthy();
      accessToken  = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });

    it("rejects wrong password with 401", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: USER.email, password: "WrongPass!",
      });
      expect(res.status).toBe(401);
      expect(res.body.code).toBe("INVALID_CREDENTIALS");
    });

    it("rejects unknown email with 401", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nobody@ww-test.dev", password: "Test1234!",
      });
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/auth/refresh", () => {
    it("issues a new access token", async () => {
      const res = await request(app).post("/api/auth/refresh").send({ refreshToken });
      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeTruthy();
      accessToken  = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });

    it("rejects a consumed (rotated) refresh token with 401", async () => {
      // The token we just exchanged is now revoked
      const res = await request(app).post("/api/auth/refresh").send({ refreshToken: "old-token" });
      expect(res.status).toBe(401);
    });
  });

  describe("Authenticated routes", () => {
    it("rejects requests with no token with 401", async () => {
      const res = await request(app).get("/api/profile");
      expect(res.status).toBe(401);
    });

    it("rejects a malformed token with 401", async () => {
      const res = await request(app)
        .get("/api/profile")
        .set("Authorization", "Bearer not.a.jwt");
      expect(res.status).toBe(401);
    });

    it("accepts a valid token", async () => {
      const res = await request(app)
        .get("/api/onboarding/status")
        .set("Authorization", `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
    });
  });
});
