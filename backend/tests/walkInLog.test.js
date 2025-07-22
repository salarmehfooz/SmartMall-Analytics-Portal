import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/User.js";
import Store from "../models/Store.js";

let adminToken, managerToken;
let testStoreId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME || "smartmall_test",
  });

  // Create Admin user
  await request(app).post("/api/auth/register").send({
    name: "Admin",
    email: "admin@example.com",
    password: "adminpass",
    role: "admin",
  });

  const adminLogin = await request(app).post("/api/auth/login").send({
    email: "admin@example.com",
    password: "adminpass",
  });
  adminToken = adminLogin.body.token;

  // Create Store
  const storeRes = await request(app)
    .post("/api/stores")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "FashionZone",
      category: "fashion",
      floor: "1st",
    });
  testStoreId = storeRes.body.store._id;

  // Register StoreManager assigned to that store
  await request(app).post("/api/auth/register").send({
    name: "Manager",
    email: "manager@example.com",
    password: "managerpass",
    role: "storeManager",
    store: testStoreId,
  });

  const managerLogin = await request(app).post("/api/auth/login").send({
    email: "manager@example.com",
    password: "managerpass",
  });

  managerToken = managerLogin.body.token;
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe("Walk-In Log API", () => {
  it("StoreManager should add a walk-in log", async () => {
    const res = await request(app)
      .post("/api/walkinlogs")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        estimatedCustomerCount: 48,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.log.estimatedCustomerCount).toBe(48);
  });

  it("StoreManager should get their walk-in logs", async () => {
    const res = await request(app)
      .get("/api/walkinlogs/my")
      .set("Authorization", `Bearer ${managerToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it("Admin should get all walk-in logs", async () => {
    const res = await request(app)
      .get("/api/walkinlogs")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
