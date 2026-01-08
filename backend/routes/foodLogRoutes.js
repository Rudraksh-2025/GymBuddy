import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import {
    createFoodLog,
    deleteFoodLogById,
    getFoodLogsByDate,
    getFoodLogById,
} from "../controllers/FoodLogController.js";

const router = express.Router();

router.post("/", auth, createFoodLog);
router.get("/", auth, getFoodLogsByDate);
router.get("/:id", auth, getFoodLogById);
router.delete("/:id", auth, deleteFoodLogById);

export default router;
