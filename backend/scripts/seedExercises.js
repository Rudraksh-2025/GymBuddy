import mongoose from "mongoose";
import dotenv from "dotenv";
import Exercise from "../models/Exercise.js";
import { globalExercises } from "../seed/globalExercises.js";

dotenv.config();

const seedExercises = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    let inserted = 0;

    for (const ex of globalExercises) {
      const exists = await Exercise.findOne({
        muscleGroup: ex.muscleGroup,
        exerciseName: { $regex: new RegExp(`^${ex.exerciseName}$`, "i") },
        isGlobal: true,
      });

      if (!exists) {
        await Exercise.create({
          ...ex,
          isGlobal: true,
        });
        inserted++;
      }
    }

    console.log(`✅ Global exercises seeded: ${inserted}`);
    process.exit();
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
};

seedExercises();
