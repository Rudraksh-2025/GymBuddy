import mongoose from "mongoose";

const foodLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        date: {
            type: Date,
            required: true,
            index: true,
        },
        mealType: {
            type: String,
            enum: ["breakfast", "lunch", "dinner", "snacks"],
            required: true,
        },

        foodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food",
            required: true,
        },

        quantity: {
            type: Number,
            default: 1,
        },

        calories: { type: Number, required: true },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fats: { type: Number, default: 0 },
    },
    { timestamps: true }
);

foodLogSchema.index({ userId: 1, date: 1 });

export default mongoose.model("FoodLog", foodLogSchema);
