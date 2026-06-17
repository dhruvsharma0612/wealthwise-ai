import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "../services/prisma";
import app from "./app";

const USER = {
  email:     "goals@ww-test.dev",
  password:  "Test1234!",
  firstName: "Goals",
  lastName:  "Test",
  currency:  "INR",
};

let token  = "";
let goalId = "";

async function cleanGoals() {
  await prisma.user.deleteMany({ where: { email: USER.email } });
}

beforeAll(async () => {
  await cleanGoals();
  const res = await request(app).post("/api/auth/signup").send(USER);
  token = res.body.accessToken;
});

afterAll(async () => { await cleanGoals(); await prisma.$disconnect(); });

const auth = () => ({ Authorization: `Bearer ${token}` });

describe("Goals", () => {

  describe("POST /api/goals", () => {
    it("creates a goal and returns progress metrics", async () => {
      const res = await request(app).post("/api/goals").set(auth()).send({
        title:         "Emergency Fund",
        category:      "EMERGENCY_FUND",
        targetAmount:  600000,
        currentAmount: 100000,
        monthlySIP:    25000,
        targetDate:    "2027-06-14T00:00:00.000Z",
        priority:      "high",
      });
      expect(res.status).toBe(201);
      expect(res.body.percentComplete).toBe(17);
      expect(res.body.remaining).toBe(500000);
      expect(res.body.status).toBe("ACTIVE");
      expect(typeof res.body.monthsToTarget).toBe("number");
      goalId = res.body.id;
    });

    it("rejects negative targetAmount with 400", async () => {
      const res = await request(app).post("/api/goals").set(auth()).send({
        title: "Bad goal", category: "OTHER", targetAmount: -1000,
      });
      expect(res.status).toBe(400);
    });

    it("rejects missing title with 400", async () => {
      const res = await request(app).post("/api/goals").set(auth()).send({
        category: "OTHER", targetAmount: 10000,
      });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/goals", () => {
    it("lists the user's goals", async () => {
      const res = await request(app).get("/api/goals").set(auth());
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.goals)).toBe(true);
      expect(res.body.goals.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("GET /api/goals/:goalId", () => {
    it("returns a single goal", async () => {
      const res = await request(app).get(`/api/goals/${goalId}`).set(auth());
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(goalId);
    });

    it("returns 404 for unknown id", async () => {
      const res = await request(app).get("/api/goals/nonexistent-id").set(auth());
      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/goals/:goalId/contribute", () => {
    it("increases currentAmount and recalculates percent", async () => {
      const res = await request(app)
        .post(`/api/goals/${goalId}/contribute`)
        .set(auth())
        .send({ amount: 100000 });
      expect(res.status).toBe(200);
      expect(res.body.currentAmount).toBe(200000);
      expect(res.body.percentComplete).toBe(33);
    });

    it("auto-completes goal when contribution reaches target", async () => {
      // fund the remaining 400000
      const res = await request(app)
        .post(`/api/goals/${goalId}/contribute`)
        .set(auth())
        .send({ amount: 400000 });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("COMPLETED");
      expect(res.body.percentComplete).toBe(100);
    });

    it("rejects zero contribution with 400", async () => {
      const res = await request(app)
        .post(`/api/goals/${goalId}/contribute`)
        .set(auth())
        .send({ amount: 0 });
      expect(res.status).toBe(400);
    });
  });

  describe("PATCH /api/goals/:goalId", () => {
    it("updates goal fields", async () => {
      const res = await request(app)
        .patch(`/api/goals/${goalId}`)
        .set(auth())
        .send({ title: "Updated Fund", priority: "low" });
      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Updated Fund");
      expect(res.body.priority).toBe("low");
    });

    it("rejects empty body with 400", async () => {
      const res = await request(app)
        .patch(`/api/goals/${goalId}`)
        .set(auth())
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/goals/:goalId", () => {
    it("deletes the goal", async () => {
      const res = await request(app).delete(`/api/goals/${goalId}`).set(auth());
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 404 after deletion", async () => {
      const res = await request(app).get(`/api/goals/${goalId}`).set(auth());
      expect(res.status).toBe(404);
    });
  });
});
