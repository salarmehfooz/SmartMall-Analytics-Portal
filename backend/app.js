import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import walkInLogRoutes from "./routes/walkInLogRoutes.js";
import telcoTrendRoutes from "./routes/telcoTrendRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";

dotenv.config();
const app = express();
app.use(cookieParser());

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const accessLogStream = fs.createWriteStream(path.join(logDir, "access.log"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.json());

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

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/walkinlogs", walkInLogRoutes);
app.use("/api/telcotrends", telcoTrendRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

export default app;
