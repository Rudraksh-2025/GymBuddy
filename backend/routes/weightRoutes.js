// routes/weightRoutes.js
import express from "express";
import { addWeight, getWeightHistory, getWeightSummary, deleteWeight } from "../controllers/weightController.js";
import { auth } from "../middleware/authMiddleware.js"; // Auth middleware

const router = express.Router();

router.post("/", auth, addWeight);
router.get("/", auth, getWeightHistory);
router.get('/summary', auth, getWeightSummary);
router.delete("/:id", auth, deleteWeight);

export default router;
