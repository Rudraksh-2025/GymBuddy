import mongoose from "mongoose";
import FoodLog from "../models/FoodLog.js";

/* ---------------------------------------------------
   CREATE FOOD LOG
--------------------------------------------------- */
export const createFoodLog = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            foodId,
            quantity,
            mealType,
            date,
            calories,
            protein,
            carbs,
            fats,
        } = req.body;

        if (!foodId || !mealType || !date || calories == null) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        const log = await FoodLog.create({
            userId,
            foodId,
            mealType,
            quantity: quantity || 1,
            date: new Date(date),
            calories,
            protein: protein || 0,
            carbs: carbs || 0,
            fats: fats || 0,
        });

        res.status(201).json({
            success: true,
            data: log,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create food log",
        });
    }
};

/* ---------------------------------------------------
   DELETE FOOD LOG BY ID
--------------------------------------------------- */
export const deleteFoodLogById = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await FoodLog.findOneAndDelete({
            _id: id,
            userId: req.user.id,
        });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Food log not found",
            });
        }

        res.json({
            success: true,
            message: "Food log deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete food log",
        });
    }
};

/* ---------------------------------------------------
   GET ALL FOOD LOGS (DATE-WISE, MEAL-WISE)
--------------------------------------------------- */
export const getFoodLogsByDate = async (req, res) => {
    try {
        const userId = req.user.id;
        const { date } = req.query;

        const targetDate = date ? new Date(date) : new Date();
        targetDate.setHours(0, 0, 0, 0);

        const endDate = new Date(targetDate);
        endDate.setHours(23, 59, 59, 999);

        const logs = await FoodLog.find({
            userId,
            date: { $gte: targetDate, $lte: endDate },
        })
            .populate("foodId", "name")
            .sort({ createdAt: 1 });

        // Group by meal
        const grouped = {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: [],
        };

        logs.forEach((log) => {
            grouped[log.mealType].push(log);
        });

        res.json({
            success: true,
            data: grouped,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch food logs",
        });
    }
};

/* ---------------------------------------------------
   GET FOOD LOG BY ID
--------------------------------------------------- */
export const getFoodLogById = async (req, res) => {
    try {
        const { id } = req.params;

        const log = await FoodLog.findOne({
            _id: id,
            userId: req.user.id,
        }).populate("foodId", "name");

        if (!log) {
            return res.status(404).json({
                success: false,
                message: "Food log not found",
            });
        }

        res.json({
            success: true,
            data: log,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch food log",
        });
    }
};
