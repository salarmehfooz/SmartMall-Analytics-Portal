import express from "express";
import * as walkInLogController from "../controllers/walkInLogController.js";
import {
  verifyToken,
  isAdmin,
  isStoreManager,
} from "../controllers/authController.js";

const router = express.Router();

// StoreManager: Add & View own logs
router.post("/", verifyToken, isStoreManager, walkInLogController.addWalkInLog);
router.get(
  "/my",
  verifyToken,
  isStoreManager,
  walkInLogController.getMyStoreLogs
);

// Admin: View all logs or by store
router.get("/", verifyToken, isAdmin, walkInLogController.getAllWalkInLogs);

export default router;
