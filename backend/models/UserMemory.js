import mongoose from "mongoose";

const userMemorySchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        type: {
            type: String,
            enum: ["diet", "exercise", "injury", "schedule", "preference"],
            required: true,
        },

        key: { type: String, required: true },   // eg: vegetarian, hate_running
        value: { type: String, required: true }, // eg: true / knee pain

        sourceText: String, // original message

        confidence: { type: Number, default: 1 }, // future use
    },
    { timestamps: true }
);

export default mongoose.model("UserMemory", userMemorySchema);