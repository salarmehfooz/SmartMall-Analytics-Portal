import express from "express";
import {
  login,
  verifyToken,
  isAdmin,
  registerStoreManager,
  registerAdmin,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);

router.post("/register", verifyToken, isAdmin, registerStoreManager);

router.post("/adminreg", registerAdmin);

export default router;
