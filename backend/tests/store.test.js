import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import Store from "../models/Store.js";
import User from "../models/User.js";

let adminToken;
let createdStoreId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME || "smartmall_test",
  });

  // Register Admin
  const adminRes = await request(app).post("/api/auth/register").send({
    name: "Admin User",
    email: "admin@example.com",
    password: "adminpass",
    role: "admin",
  });

  // Login Admin
  const loginRes = await request(app).post("/api/auth/login").send({
    email: "admin@example.com",
    password: "adminpass",
  });

  adminToken = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe("Store API (Admin)", () => {
  it("should create a store", async () => {
    const res = await request(app)
      .post("/api/stores")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "TechWorld",
        category: "electronics",
        floor: "2nd",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.store.name).toBe("TechWorld");

    createdStoreId = res.body.store._id;
  });

  it("should fetch all stores", async () => {
    const res = await request(app)
      .get("/api/stores")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get store by ID", async () => {
    const res = await request(app)
      .get(`/api/stores/${createdStoreId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.store._id).toBe(createdStoreId);
  });

  it("should update a store", async () => {
    const res = await request(app)
      .put(`/api/stores/${createdStoreId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "TechWorld Updated",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.store.name).toBe("TechWorld Updated");
  });

  it("should delete a store", async () => {
    const res = await request(app)
      .delete(`/api/stores/${createdStoreId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
