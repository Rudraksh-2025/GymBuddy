// controllers/foodController.js
import mongoose from "mongoose";
import DailyGoal from "../models/DailyGoal.js";
import FoodLog from "../models/FoodLog.js";
import Food from "../models/Food.js";


export const getFoodSummary = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        // ---------- DATE RANGES ----------
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfWeek.getDate() - 6);

        // ---------- FETCH DAILY GOAL ----------
        const goal = await DailyGoal.findOne({ userId }).lean();

        const goalData = {
            calories: goal?.calories ?? 0,
            protein: goal?.protein ?? 0,
            carbs: goal?.carbs ?? 0,
            fats: goal?.fats ?? 0,
        };

        // ---------- TODAY CONSUMED (CAL + MACROS) ----------
        const todayAgg = await FoodLog.aggregate([
            {
                $match: {
                    userId,
                    date: { $gte: startOfToday, $lte: endOfToday },
                },
            },
            {
                $group: {
                    _id: null,
                    calories: { $sum: "$calories" },
                    protein: { $sum: "$protein" },
                    carbs: { $sum: "$carbs" },
                    fats: { $sum: "$fats" },
                },
            },
        ]);

        const consumedData = {
            calories: todayAgg[0]?.calories || 0,
            protein: todayAgg[0]?.protein || 0,
            carbs: todayAgg[0]?.carbs || 0,
            fats: todayAgg[0]?.fats || 0,
        };

        // ---------- WEEKLY CALORIE TOTAL ----------
        const weeklyAgg = await FoodLog.aggregate([
            {
                $match: {
                    userId,
                    date: { $gte: startOfWeek, $lte: endOfToday },
                },
            },
            {
                $group: {
                    _id: {
                        day: {
                            $dateToString: { format: "%Y-%m-%d", date: "$date" },
                        },
                    },
                    calories: { $sum: "$calories" },
                },
            },
        ]);

        const caloriesByDay = weeklyAgg.reduce((acc, d) => {
            acc[d._id.day] = d.calories;
            return acc;
        }, {});

        let weeklyTotalCalories = 0;
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(d.getDate() + i);
            const key = d.toISOString().split("T")[0];
            weeklyTotalCalories += caloriesByDay[key] || 0;
        }

        const weeklyAverageCalories = Number(
            (weeklyTotalCalories / 7).toFixed(2)
        );

        // ---------- FINAL RESPONSE ----------
        return res.json({
            success: true,
            data: {
                today: {
                    goal: goalData,
                    consumed: consumedData,
                },
                weekly: {
                    averageCalories: weeklyAverageCalories,
                    totalCalories: weeklyTotalCalories,
                },
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch food summary",
        });
    }
};

// CREATE FOOD
export const createFood = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, calories, protein = 0, carbs = 0, fats = 0, isReusable = true, servingSize } = req.body;

        if (!name || calories == null) {
            return res.status(400).json({ message: "Name and calories are required" });
        }

        const food = await Food.create({
            userId,
            name,
            calories,
            protein,
            carbs,
            fats,
            servingSize,
            isReusable,
        });

        res.status(201).json({
            success: true,
            data: food,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create food",
        });
    }
};

// GET ALL FOODS (USER LIBRARY)
export const getAllFoods = async (req, res) => {
    try {
        const foods = await Food.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: foods,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch foods",
        });
    }
};

// UPDATE FOOD BY ID
export const updateFoodById = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await Food.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Food not found" });
        }

        res.json({
            success: true,
            data: updated,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update food",
        });
    }
};

// DELETE FOOD BY ID
export const deleteFoodById = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Food.findOneAndDelete({
            _id: id,
            userId: req.user.id,
        });

        if (!deleted) {
            return res.status(404).json({ message: "Food not found" });
        }

        res.json({
            success: true,
            message: "Food deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete food",
        });
    }
};
