import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        calories: { type: Number, required: true },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fats: { type: Number, default: 0 },

        isReusable: {
            type: Boolean,
            default: true, // saved food
        },
    },
    { timestamps: true }
);

export default mongoose.model("Food", foodSchema);
