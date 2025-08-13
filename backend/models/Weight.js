// models/Weight.js
import mongoose from "mongoose";

const weightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now // Auto store the date when entry is made
  }
});

export default mongoose.model("Weight", weightSchema);
