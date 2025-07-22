import express from "express";
import { generateRecommendations } from "../controllers/recommendationController.js";
import { verifyToken, isAdmin } from "../controllers/authController.js";

const router = express.Router();

// Admin-only route to generate recommendations
router.get("/", verifyToken, isAdmin, generateRecommendations);

export default router;
