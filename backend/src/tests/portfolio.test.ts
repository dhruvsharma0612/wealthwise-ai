import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "../services/prisma";
import app from "./app";

const USER = {
  email:     "portfolio@ww-test.dev",
  password:  "Test1234!",
  firstName: "Portfolio",
  lastName:  "Test",
  currency:  "INR",
};

let token   = "";
let assetId = "";

async function cleanPortfolio() {
  await prisma.user.deleteMany({ where: { email: USER.email } });
}

beforeAll(async () => {
  await cleanPortfolio();
  const res = await request(app).post("/api/auth/signup").send(USER);
  token = res.body.accessToken;
});

afterAll(async () => { await cleanPortfolio(); await prisma.$disconnect(); });

const auth = () => ({ Authorization: `Bearer ${token}` });

describe("Portfolio", () => {

  describe("GET /api/portfolio", () => {
    it("returns empty portfolio on signup", async () => {
      const res = await request(app).get("/api/portfolio").set(auth());
      expect(res.status).toBe(200);
      expect(res.body.assets).toHaveLength(0);
      expect(res.body.allocation.totalValue).toBe(0);
    });
  });

  describe("POST /api/portfolio/assets", () => {
    it("adds an ETF asset", async () => {
      const res = await request(app).post("/api/portfolio/assets").set(auth()).send({
        symbol:      "NIFTY50",
        name:        "Nifty 50 Index Fund",
        type:        "ETF",
        quantity:    100,
        avgBuyPrice: 220,
      });
      expect(res.status).toBe(201);
      expect(res.body.symbol).toBe("NIFTY50");
      expect(res.body.currentValue).toBe(22000);
      assetId = res.body.id;
    });

    it("auto-uppercases symbol", async () => {
      const res = await request(app).post("/api/portfolio/assets").set(auth()).send({
        symbol:      "gold",
        name:        "Digital Gold",
        type:        "GOLD",
        quantity:    5,
        avgBuyPrice: 6500,
      });
      expect(res.status).toBe(201);
      expect(res.body.symbol).toBe("GOLD");
    });

    it("merges same symbol and blends avg price", async () => {
      // Add 100 more NIFTY50 @ 240 → avg should be (100×220 + 100×240)/200 = 230
      const res = await request(app).post("/api/portfolio/assets").set(auth()).send({
        symbol:      "NIFTY50",
        name:        "Nifty 50 Index Fund",
        type:        "ETF",
        quantity:    100,
        avgBuyPrice: 240,
      });
      expect(res.status).toBe(201);
      expect(res.body.quantity).toBe(200);
      expect(res.body.avgBuyPrice).toBe(230);
      expect(res.body.currentValue).toBe(46000);
      assetId = res.body.id;  // update to merged id
    });

    it("rejects zero quantity with 400", async () => {
      const res = await request(app).post("/api/portfolio/assets").set(auth()).send({
        symbol: "FAIL", name: "Fail", type: "STOCK", quantity: 0, avgBuyPrice: 100,
      });
      expect(res.status).toBe(400);
    });

    it("rejects invalid asset type with 400", async () => {
      const res = await request(app).post("/api/portfolio/assets").set(auth()).send({
        symbol: "X", name: "X", type: "INVALID_TYPE", quantity: 1, avgBuyPrice: 100,
      });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/portfolio/allocation", () => {
    it("returns allocation breakdown with percentages", async () => {
      const res = await request(app).get("/api/portfolio/allocation").set(auth());
      expect(res.status).toBe(200);
      expect(res.body.totalValue).toBeGreaterThan(0);
      expect(Array.isArray(res.body.byType)).toBe(true);
      const allocations = res.body.byType.map((b: any) => b.allocation);
      const total = allocations.reduce((s: number, v: number) => s + v, 0);
      expect(total).toBeCloseTo(100, 0);
    });

    it("includes a diversification score", async () => {
      const res = await request(app).get("/api/portfolio/allocation").set(auth());
      expect(typeof res.body.diversificationScore).toBe("number");
      expect(res.body.diversificationScore).toBeGreaterThanOrEqual(1);
    });
  });

  describe("PATCH /api/portfolio/assets/:assetId", () => {
    it("updates quantity", async () => {
      const res = await request(app)
        .patch(`/api/portfolio/assets/${assetId}`)
        .set(auth())
        .send({ quantity: 300 });
      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(300);
    });

    it("rejects empty body with 400", async () => {
      const res = await request(app)
        .patch(`/api/portfolio/assets/${assetId}`)
        .set(auth())
        .send({});
      expect(res.status).toBe(400);
    });

    it("returns 404 for unknown asset", async () => {
      const res = await request(app)
        .patch("/api/portfolio/assets/nonexistent")
        .set(auth())
        .send({ quantity: 1 });
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/portfolio/assets/:assetId", () => {
    it("removes the asset", async () => {
      const res = await request(app)
        .delete(`/api/portfolio/assets/${assetId}`)
        .set(auth());
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
