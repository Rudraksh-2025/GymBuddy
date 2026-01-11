// foodRoutes.js
import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { createFood, getAllFoods, updateFoodById, deleteFoodById, getFoodSummary,updateDailyGoal } from '../controllers/FoodController.js';

const router = express.Router();
router.get("/summary", auth, getFoodSummary);
router.put("/summary", auth, updateDailyGoal);
router.post("/", auth, createFood);
router.get("/", auth, getAllFoods);
router.put("/:id", auth, updateFoodById);
router.delete("/:id", auth, deleteFoodById);
export default router;