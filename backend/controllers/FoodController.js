// controllers/foodController.js
import mongoose from "mongoose";
import DailyGoal from "../models/DailyGoal.js";
import FoodLog from "../models/FoodLog.js";
import Food from "../models/Food.js";
import { calcMacrosFromCalories } from "../utils/calcMacrosFromCalories.js";
import { calcBMR, calcTDEE, applyGoalType, calcMacrosFromCaloriesPct } from "../utils/nutrition.js";
import User from '../models/User.js'


export const getFoodSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    let goal = await DailyGoal.findOne({ userId }).lean();

    let bmr, tdee, calories, protein, carbs, fats, macrosPct;
    bmr = calcBMR(user);
    tdee = calcTDEE(bmr, user.activityLevel);
    // ---------- AUTO CALCULATE IF NOT SET ----------
    if (!goal) {

      calories = Math.round(applyGoalType(tdee, user.goalType));

      macrosPct = { protein: 25, carbs: 50, fats: 25 };

      const grams = calcMacrosFromCaloriesPct(calories, macrosPct);

      protein = grams.protein;
      carbs = grams.carbs;
      fats = grams.fats;
    }
    // ---------- USE SAVED GOALS ----------
    else {
      calories = goal.calories;
      protein = goal.protein;
      carbs = goal.carbs;
      fats = goal.fats;
      macrosPct = {
        protein: goal.proteinPct,
        carbs: goal.carbsPct,
        fats: goal.fatsPct,
      };
    }

    const baseDate = req.query.date
      ? new Date(req.query.date)
      : new Date();

    if (isNaN(baseDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    const startOfDay = new Date(baseDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(baseDate);
    endOfDay.setHours(23, 59, 59, 999);

    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - 6);

    const todayAgg = await FoodLog.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfDay, $lte: endOfDay },
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

    // WEEKLY CALORIE TOTAL
    const weeklyAgg = await FoodLog.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfWeek, $lte: endOfDay },
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
        date: startOfDay,
        today: {
          goal: { calories, protein, carbs, fats },
          consumed: consumedData,
        },
        weekly: {
          averageCalories: weeklyAverageCalories,
          totalCalories: weeklyTotalCalories,
        },
        macrosPct,
        bmr,
        tdee,
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

export const updateDailyGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    let { calories, proteinPct, carbsPct, fatsPct } = req.body;


    if (calories == null) {
      return res.status(400).json({
        success: false,
        message: "Calories goal is required",
      });
    }

    calories = Number(calories);
    proteinPct = Number(proteinPct);
    carbsPct = Number(carbsPct);
    fatsPct = Number(fatsPct);

    if (
      [calories, proteinPct, carbsPct, fatsPct].some((v) => Number.isNaN(v))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid numeric values",
      });
    }

    const totalPct = proteinPct + carbsPct + fatsPct;
    if (totalPct !== 100) {
      return res.status(400).json({
        success: false,
        message: "Macro percentages must total 100%",
      });
    }

    // 🔥 AUTO CALCULATE MACROS IN GRAMS
    const { protein, carbs, fats } = calcMacrosFromCalories(calories, {
      proteinPct,
      carbsPct,
      fatsPct,
    });

    const goal = await DailyGoal.findOneAndUpdate(
      { userId },
      {
        calories,
        protein,
        carbs,
        fats,
        proteinPct,
        carbsPct,
        fatsPct,
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: "Daily goals updated",
      data: goal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update daily goals",
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
      isGlobal: false,
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
    const userId = req.user.id;
    const { search } = req.query;

    const filter = {
      $or: [{ isGlobal: true }, { userId }],
    };

    if (search) {
      filter.$and = [
        { $or: [{ isGlobal: true }, { userId }] },
        { name: { $regex: search, $options: "i" } }, // case-insensitive
      ];
      delete filter.$or;
    }

    const foods = await Food.find(filter).sort({ name: 1 });

    res.json({ success: true, data: foods });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Failed to fetch foods" });
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
