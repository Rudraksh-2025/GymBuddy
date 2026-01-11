import mongoose from "mongoose";

const dailyGoalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        calories: { type: Number, required: true }, // kcal
        protein: { type: Number, required: true },  // grams
        carbs: { type: Number, required: true },    // grams
        fats: { type: Number, required: true },     // grams

        proteinPct: { type: Number, default: 25 },
        carbsPct: { type: Number, default: 50 },
        fatsPct: { type: Number, default: 25 },
        
        bmr: { type: Number, required: true },
        tdee: { type: Number, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("DailyGoal", dailyGoalSchema);
