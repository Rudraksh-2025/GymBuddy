import mongoose from "mongoose";
const exerciseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    muscleGroup: { type: String, required: true }, // back, biceps, etc.
    exerciseName: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Exercise", exerciseSchema);
