import express from "express";
import * as telcoTrendController from "../controllers/telcoTrendController.js";
import {
  verifyToken,
  isAdmin,
  isStoreManager,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/", verifyToken, isAdmin, telcoTrendController.createTelcoTrend);
router.get("/", verifyToken, isAdmin, telcoTrendController.getAllTelcoTrends);

router.get(
  "/my-category",
  verifyToken,
  isStoreManager,
  telcoTrendController.getMyCategoryTrends
);

export default router;
