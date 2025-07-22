import express from "express";
import * as telcoTrendController from "../controllers/telcoTrendController.js";
import {
  verifyToken,
  isAdmin,
  isStoreManager,
} from "../controllers/authController.js";

const router = express.Router();

// Admin-only routes
router.post("/", verifyToken, isAdmin, telcoTrendController.createTelcoTrend);
router.get("/", verifyToken, isAdmin, telcoTrendController.getAllTelcoTrends);

// StoreManager route - view trends for their store's category
router.get(
  "/my-category",
  verifyToken,
  isStoreManager,
  telcoTrendController.getMyCategoryTrends
);

export default router;
