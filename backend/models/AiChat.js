import mongoose from "mongoose";

const aiChatSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true,
        },

        content: { type: String, required: true },

        intent: { type: String }, // optional but useful for analytics
    },
    { timestamps: true }
);

export default mongoose.model("AIChat", aiChatSchema);