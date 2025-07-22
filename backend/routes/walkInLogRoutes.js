import express from "express";
import * as walkInLogController from "../controllers/walkInLogController.js";
import {
  verifyToken,
  isAdmin,
  isStoreManager,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/", verifyToken, isStoreManager, walkInLogController.addWalkInLog);
router.get(
  "/my",
  verifyToken,
  isStoreManager,
  walkInLogController.getMyStoreLogs
);

router.get("/", verifyToken, isAdmin, walkInLogController.getAllWalkInLogs);

export default router;
