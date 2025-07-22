import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";

// Import your route files
import authRoutes from "./routes/authRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import walkInLogRoutes from "./routes/walkInLogRoutes.js";
import telcoTrendRoutes from "./routes/telcoTrendRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";

dotenv.config();
const app = express();
app.use(cookieParser());

// Setup logging to logs/access.log
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const accessLogStream = fs.createWriteStream(path.join(logDir, "access.log"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.json());

// CORS setup (update whitelist if needed)
const whitelist = ["http://localhost:5173"];
app.use(
  cors({
    origin: whitelist,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to SmartMall API Server");
});

// Mount routes under /api
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/walkinlogs", walkInLogRoutes);
app.use("/api/telcotrends", telcoTrendRoutes);
app.use("/api/recommendations", recommendationRoutes);

// Optional: Error handling middleware (catch-all)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

export default app;
