import cron from "node-cron";
import User from "../models/User.js";
import FoodLog from "../models/FoodLog.js";
import ExerciseLog from "../models/Workout.js";
import DailyGoal from "../models/DailyGoal.js";
import Insight from "../models/insightSchema.js";
import { generateRuleInsights } from "../utils/generateRuleInsights.js";

export const startAutoInsightsJob = () => {
    cron.schedule("* * * * *", async () => {
        console.log("🔥 Running Auto Insights Job");

        const users = await User.find({}).select("_id");

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - 6);

        for (const u of users) {
            const userId = u._id;

            try {
                const goal = await DailyGoal.findOne({ userId }).lean();
                if (!goal) {
                    continue;
                }

                const foodAgg = await FoodLog.aggregate([
                    { $match: { userId, date: { $gte: today } } },
                    {
                        $group: {
                            _id: null,
                            calories: { $sum: "$calories" },
                            protein: { $sum: "$protein" },
                        },
                    },
                ]);

                const todayFood = {
                    calories: foodAgg[0]?.calories || 0,
                    protein: foodAgg[0]?.protein || 0,
                };

                const weeklyWorkoutCount = await ExerciseLog.countDocuments({
                    userId,
                    date: { $gte: weekStart },
                });

                const insights = generateRuleInsights({
                    goal,
                    todayFood,
                    weeklyWorkoutCount,
                });

                if (insights.length) {
                    await Insight.insertMany(
                        insights.map((i) => ({ ...i, userId }))
                    );
                }
            } catch (err) {
                console.error("Auto Insights Job error for user", userId, err);
            }
        }
    });
};
