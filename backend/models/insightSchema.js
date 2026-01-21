import mongoose from "mongoose";

const insightSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

        type: {
            type: String,
            enum: ["nutrition", "workout", "recovery", "streak", "warning"],
        },

        title: String,
        message: String,

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "low",
        },

        date: { type: Date, default: Date.now },

        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model("Insight", insightSchema);
