import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/User.js";
import Store from "../models/Store.js";
import TelcoTrend from "../models/TelcoTrend.js";
import WalkInLog from "../models/WalkInLog.js";

let adminToken;
let testStoreId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME || "smartmall_test",
  });

  // Register Admin user
  await request(app).post("/api/auth/register").send({
    name: "Admin",
    email: "admin@example.com",
    password: "adminpass",
    role: "admin",
  });

  // Login Admin user
  const loginRes = await request(app).post("/api/auth/login").send({
    email: "admin@example.com",
    password: "adminpass",
  });
  adminToken = loginRes.body.token;

  // Create a Store
  const storeRes = await request(app)
    .post("/api/stores")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "GadgetHub",
      category: "electronics",
      floor: "3rd",
    });
  testStoreId = storeRes.body.store._id;

  // Create a TelcoTrend matching store category with high trendScore
  await TelcoTrend.create({
    category: "electronics",
    trendScore: 80,
    recordedAt: new Date(),
  });

  // Create WalkInLogs for the store with high footfall
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    await WalkInLog.create({
      store: testStoreId,
      timestamp: new Date(now.getTime() - i * 24 * 60 * 60 * 1000),
      estimatedCustomerCount: 60,
    });
  }
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe("Recommendation API", () => {
  it("should return recommendations for admin", async () => {
    const res = await request(app)
      .get("/api/recommendations")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const recForStore = res.body.find((rec) => rec.store === "GadgetHub");

    expect(recForStore).toBeDefined();
    expect(recForStore.suggestions).toEqual(
      expect.arrayContaining([
        expect.stringContaining("High interest in electronics"),
        expect.stringContaining("High average footfall"),
      ])
    );
  });
});
