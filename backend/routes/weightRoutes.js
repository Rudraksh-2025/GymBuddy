// routes/weightRoutes.js
import express from "express";
import { addWeight, getWeightHistory } from "../controllers/weightController.js";
import { auth } from "../middleware/authMiddleware.js"; // Auth middleware

const router = express.Router();

router.post("/", auth, addWeight);
router.get("/", auth, getWeightHistory);

export default router;
