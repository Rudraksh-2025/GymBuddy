import OpenAI from "openai";
import mongoose from "mongoose";
import User from "../models/User.js";
import FoodLog from "../models/FoodLog.js";
import ExerciseLog from "../models/Workout.js";
import DailyGoal from "../models/DailyGoal.js";
import Weight from '../models/Weight.js'
import AiChat from "../models/AiChat.js";
import { buildPromptByIntent } from "../utils/buildPromptByIntent.js";
import { detectIntent } from "../utils/detectIntent.js";
import UserMemory from "../models/UserMemory.js";
import { extractUserMemory } from "../utils/extractUserMemory.js";
import insightSchema from '../models/insightSchema.js'
import { extractDateFromText } from "../utils/extractDateFromText.js";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const aiChat = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const { message } = req.body;

        // -------- MEMORY EXTRACTION --------
        const newMemories = extractUserMemory(message);

        for (const mem of newMemories) {
            const exists = await UserMemory.findOne({
                userId,
                key: mem.key,
            });

            if (!exists) {
                await UserMemory.create({
                    userId,
                    ...mem,
                    sourceText: message,
                });
            }
        }


        if (!message) {
            return res.status(400).json({ message: "Message required" });
        }

        /* ---------------- USER DATA ---------------- */
        const user = await User.findById(userId).lean();
        const goal = await DailyGoal.findOne({ userId }).lean();

        /* ---------------- DATE ---------------- */
        const extractedDate = extractDateFromText(message);

        let startDate, endDate;

        if (extractedDate) {
            startDate = extractedDate.start;
            endDate = extractedDate.end;
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            startDate = today;
            endDate = new Date();
        }

        let weekStats = null;
        let monthStats = null;

        const now = new Date();

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const weekLogs = await Weight.find({
            userId,
            date: { $gte: startOfWeek },
        }).sort({ date: 1 });

        const monthLogs = await Weight.find({
            userId,
            date: { $gte: startOfMonth },
        }).sort({ date: 1 });

        const calcStats = (logs) => {
            if (logs.length < 2) return null;
            const start = logs[0].weight;
            const end = logs[logs.length - 1].weight;

            return {
                start,
                end,
                diff: Number((start - end).toFixed(1)),
                trend: end < start ? "decreasing" : "increasing",
            };
        };

        weekStats = calcStats(weekLogs);
        monthStats = calcStats(monthLogs);



        /* ---------------- FOOD AGG ---------------- */
        const foodAgg = await FoodLog.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    date: { $gte: startDate, $lte: endDate },
                }
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

        const foodData = foodAgg[0] || {
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
        };

        /* ---------------- MEALS ---------------- */
        const todayMeals = await FoodLog.find({
            userId,
            date: { $gte: startDate, $lte: endDate },
        })
            .populate("foodId", "name")
            .select("foodId mealType calories")
            .lean();

        const mealsText =
            todayMeals.length > 0
                ? todayMeals
                    .map(m => `- ${m.foodId?.name} (${m.mealType}, ${m.calories} kcal)`)
                    .join("\n")
                : "- No meals logged today";

        /* ---------------- WORKOUTS ---------------- */
        const todayWorkouts = await ExerciseLog.find({
            userId,
            date: { $gte: startDate, $lte: endDate },
        })
            .populate("exerciseId", "exerciseName")
            .select("exerciseId sets reps duration")
            .lean();

        const workoutsText =
            todayWorkouts.length > 0
                ? todayWorkouts
                    .map(w => `- ${w.exerciseId?.exerciseName}`)
                    .join("\n")
                : "- No workouts logged today";


        /* ---------------- INTENT ---------------- */
        const intent = detectIntent(message);

        /* ---------------- CHAT MEMORY ---------------- */
        const memory = await AiChat.find({ userId })
            .sort({ createdAt: -1 })
            .limit(6)
            .lean();

        const memoryMessages = memory
            .reverse()
            .map((m) => ({ role: m.role, content: m.content }));
        const memories = await UserMemory.find({ userId }).lean();
        const memoryText =
            memories.length > 0
                ? memories.map(m => `- ${m.type}: ${m.key} = ${m.value}`).join("\n")
                : "- None";

        /* ---------------- PROMPT ---------------- */
        const prompt = buildPromptByIntent({
            intent,
            user,
            goal,
            foodAgg: foodData,
            mealsText,
            workoutsText,
            message,
            weekStats,
            monthStats,
            memoryText
        });

        /* ---------------- OPENAI ---------------- */
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a strict fitness coach. Follow formatting rules strictly.",
                },

                ...memoryMessages,

                { role: "user", content: prompt },
            ],
        });

        let reply = completion.choices[0].message.content;

        reply = reply
            .replace(/^[•-]\s*/gm, "- ")
            .trim();

        /* ---------------- SAVE CHAT ---------------- */
        await AiChat.insertMany([
            { userId, role: "user", content: message, intent },
            { userId, role: "assistant", content: reply, intent },
        ]);

        res.json({ reply, intent });
    } catch (err) {
        console.error("AI CHAT ERROR:", err);
        res.status(500).json({ message: "AI Coach error" });
    }
};

export const getInsights = async (req, res) => {
    const insights = await insightSchema.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .limit(10);

    res.json({ success: true, data: insights });
};
