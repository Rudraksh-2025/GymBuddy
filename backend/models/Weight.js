import mongoose from "mongoose";

const weightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    // day: {
    //   type: String,
    //   required: true,
    // },
    weight: {
      type: Number,
      required: true,
    },
    change: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Weight", weightSchema);
