import mongoose from "mongoose";
import FoodLog from "../models/FoodLog.js";
import Weight from "../models/Weight.js";
import Workout from "../models/Workout.js";
import DailyGoal from "../models/DailyGoal.js";

export const getDashboardSummary = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const endToday = new Date();
        endToday.setHours(23, 59, 59, 999);

        const startWeek = new Date(today);
        startWeek.setDate(startWeek.getDate() - 6);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);




        /* ---------------- CALORIES ---------------- */

        const goal = await DailyGoal.findOne({ userId }).lean();

        const todayAgg = await FoodLog.aggregate([
            { $match: { userId, date: { $gte: today, $lte: endToday } } },
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

        const todayConsumed = {
            calories: todayAgg[0]?.calories || 0,
            protein: todayAgg[0]?.protein || 0,
            carbs: todayAgg[0]?.carbs || 0,
            fats: todayAgg[0]?.fats || 0,
        };


        // const todayConsumed = todayCaloriesAgg[0]?.calories || 0;

        const weeklyAgg = await FoodLog.aggregate([
            { $match: { userId, date: { $gte: startWeek, $lte: endToday } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    calories: { $sum: "$calories" },
                },
            },
        ]);

        const weeklyTotal = weeklyAgg.reduce((s, d) => s + d.calories, 0);
        const weeklyAvg = Math.round(weeklyTotal / 7);

        const firstDayOfMonth = new Date(startOfMonth).getDay(); // 0 (Sun) - 6 (Sat)

        const monthlyWeekAgg = await FoodLog.aggregate([
            {
                $match: {
                    userId,
                    date: { $gte: startOfMonth, $lte: endOfMonth },
                },
            },
            {
                $addFields: {
                    dayOfMonth: { $dayOfMonth: "$date" },
                },
            },
            {
                $addFields: {
                    weekOfMonth: {
                        $ceil: {
                            $divide: [
                                { $add: ["$dayOfMonth", firstDayOfMonth] },
                                7,
                            ],
                        },
                    },
                },
            },
            {
                $group: {
                    _id: "$weekOfMonth",
                    calories: { $sum: "$calories" },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        const monthlyWeekMap = {};
        monthlyWeekAgg.forEach((w) => {
            monthlyWeekMap[w._id] = w.calories;
        });

        const monthlyWeeklyChart = [];

        for (let w = 1; w <= 5; w++) {
            monthlyWeeklyChart.push({
                name: `Week ${w}`,
                calories: monthlyWeekMap[w] || 0,
            });
        }
        const weeklyMap = {};
        weeklyAgg.forEach((d) => {
            weeklyMap[d._id] = d.calories;
        });

        const weekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const weeklyChart = [];

        for (let i = 0; i < 7; i++) {
            const d = new Date(startWeek);
            d.setDate(d.getDate() + i);

            const key = d.toISOString().split("T")[0];

            weeklyChart.push({
                name: weekNames[d.getDay()],   // label
                date: key,
                calories: weeklyMap[key] || 0,
            });
        }



        /* ---------------- WEIGHT ---------------- */

        const lastWeight = await Weight.findOne({ userId })
            .sort({ date: -1 })
            .lean();

        const firstWeight = await Weight.findOne({ userId })
            .sort({ date: 1 })
            .lean();

        const totalLost =
            firstWeight && lastWeight
                ? Number((firstWeight.weight - lastWeight.weight).toFixed(1))
                : 0;

        /* ---------------- WORKOUTS ---------------- */

        const workoutsThisWeekAgg = await Workout.aggregate([
            { $match: { userId, date: { $gte: startWeek, $lte: endToday } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } } } },
            { $count: "days" }
        ]);

        const workoutsThisWeek = workoutsThisWeekAgg[0]?.days || 0;


        const recentWorkouts = await Workout.find({ userId })
            .sort({ date: -1 })
            .limit(3)
            .populate("exerciseId", "exerciseName muscleGroup")
            .lean();


        /* ---------------- MEALS ---------------- */

        const recentMeals = await FoodLog.find({ userId })
            .sort({ date: -1 })
            .limit(3)
            .populate("foodId", "name")
            .lean();

        /* ---------------- STEPS ---------------- */

        // const todaySteps = await StepLog.findOne({ userId, date: today }).lean();

        // const yesterday = new Date(today);
        // yesterday.setDate(yesterday.getDate() - 1);

        // const yesterdaySteps = await StepLog.findOne({
        //     userId,
        //     date: yesterday,
        // }).lean();

        // let stepChangePct = 0;
        // let stepFlag = "up";

        // if (yesterdaySteps?.steps) {
        //     stepChangePct = Math.round(
        //         ((todaySteps?.steps || 0) - yesterdaySteps.steps) /
        //         yesterdaySteps.steps *
        //         100
        //     );
        //     stepFlag = stepChangePct >= 0 ? "up" : "down";
        //     stepChangePct = Math.abs(stepChangePct);
        // }

        /* ---------------- CHART DATA ---------------- */






        /* ---------------- FINAL ---------------- */

        res.json({
            success: true,
            data: {
                calories: {
                    todayConsumed,
                    goal: goal?.calories || 0,
                    weeklyAvg,
                },
                macros: {
                    consumed: {
                        protein: todayConsumed.protein,
                        carbs: todayConsumed.carbs,
                        fats: todayConsumed.fats,
                    },
                    goal: {
                        protein: goal?.protein || 0,
                        carbs: goal?.carbs || 0,
                        fats: goal?.fats || 0,
                    },
                },

                weight: {
                    current: lastWeight?.weight || 0,
                    totalLost,
                    bodyFat: lastWeight?.bodyFat || 0,
                    target: goal?.targetWeight || 0,
                },

                // steps: {
                //     today: todaySteps?.steps || 0,
                //     changePct: stepChangePct,
                //     flag: stepFlag,
                // },

                workouts: {
                    thisWeek: workoutsThisWeek,
                    recent: recentWorkouts.map(
                        (w) => w.exerciseId?.exerciseName || "Workout"
                    ),

                },

                meals: recentMeals.map((m) => m.foodId?.name || "Food"),

                charts: {
                    weekly: weeklyChart,
                    monthly: monthlyWeeklyChart,
                },
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Dashboard failed" });
    }
};
