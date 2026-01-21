import mongoose from "mongoose";
const foodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null = global food
      index: true,
    },

    name: { type: String, required: true, trim: true },

    calories: { type: Number, required: true },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },

    servingSize: { type: String, required: true },

    isReusable: { type: Boolean, default: true },

    isGlobal: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Food", foodSchema);
