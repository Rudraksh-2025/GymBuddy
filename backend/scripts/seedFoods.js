import mongoose from "mongoose";
import Food from "../models/Food.js";
import { basicFoods } from "../seed/basicFoods.js";
import dotenv from "dotenv";
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

for (const food of basicFoods) {
  await Food.updateOne(
    { name: food.name, isGlobal: true },
    { ...food, isGlobal: true, userId: null },
    { upsert: true }
  );
}

console.log("✅ Basic foods seeded");
process.exit();
