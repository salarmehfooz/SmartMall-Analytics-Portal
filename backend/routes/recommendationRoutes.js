import express from "express";
import { generateRecommendations } from "../controllers/recommendationController.js";
import { verifyToken, isAdmin } from "../controllers/authController.js";

const router = express.Router();


router.get("/", verifyToken, isAdmin, generateRecommendations);

export default router;
