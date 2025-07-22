import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import Store from "../models/Store.js";

let adminToken, managerToken;
let storeCategory = "fashion";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME || "smartmall_test",
  });

  // Register Admin
  await request(app).post("/api/auth/register").send({
    name: "Admin",
    email: "admin2@example.com",
    password: "adminpass",
    role: "admin",
  });

  const adminLogin = await request(app).post("/api/auth/login").send({
    email: "admin2@example.com",
    password: "adminpass",
  });
  adminToken = adminLogin.body.token;

  // Create Store
  const storeRes = await request(app)
    .post("/api/stores")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "FashionWorld",
      category: storeCategory,
      floor: "1st",
    });

  const storeId = storeRes.body.store._id;

  // Register StoreManager assigned to that store
  await request(app).post("/api/auth/register").send({
    name: "Trend Manager",
    email: "trendmanager@example.com",
    password: "managerpass",
    role: "storeManager",
    store: storeId,
  });

  const managerLogin = await request(app).post("/api/auth/login").send({
    email: "trendmanager@example.com",
    password: "managerpass",
  });

  managerToken = managerLogin.body.token;
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe("TelcoTrend API", () => {
  it("Admin should create a telco trend", async () => {
    const res = await request(app)
      .post("/api/telcotrends")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        category: storeCategory,
        trendScore: 85,
        recordedAt: new Date().toISOString(),
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.trend.category).toBe(storeCategory);
  });

  it("Admin should get all telco trends", async () => {
    const res = await request(app)
      .get("/api/telcotrends")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("StoreManager should get trends for their store category", async () => {
    const res = await request(app)
      .get("/api/telcotrends/my-category")
      .set("Authorization", `Bearer ${managerToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].category).toBe(storeCategory);
  });
});
