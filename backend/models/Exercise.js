import mongoose from "mongoose";
const exerciseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
        index: true,
    },
    muscleGroup: { type: String, required: true },
    exerciseName: { type: String, required: true },
    imageUrl: { type: String },
    isGlobal: { type: Boolean, default: false }

}, { timestamps: true });

export default mongoose.model("Exercise", exerciseSchema);
