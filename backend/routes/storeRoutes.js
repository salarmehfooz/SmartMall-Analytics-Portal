import express from "express";
import * as storeController from "../controllers/storeController.js";
import { verifyToken, isAdmin } from "../controllers/authController.js";

const router = express.Router();

router.use(verifyToken, isAdmin);

router.post("/", storeController.createStore);
router.get("/", storeController.getAllStores);
router.get("/:id", storeController.getStoreById);
router.put("/:id", storeController.updateStore);
router.delete("/:id", storeController.deleteStore);

export default router;
