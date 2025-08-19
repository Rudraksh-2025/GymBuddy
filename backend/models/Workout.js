// models/Workout.js
import mongoose from "mongoose";

const setSchema = new mongoose.Schema({
  reps: { type: Number, required: true },
  weight: { type: Number, required: true } // in kg
});


const exerciseLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise", required: true },
  sets: [setSchema],
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("ExerciseLog", exerciseLogSchema);
