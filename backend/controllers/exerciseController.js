// controllers/exerciseController.js
import ExerciseLog from "../models/Workout.js";
import Exercise from "../models/Exercise.js";
import mongoose from "mongoose";

// Get exercises by muscle group with last log + max weight
export const getExercisesByGroup = async (req, res) => {
  try {
    const { muscleGroup } = req.params;

    // Find exercises for this user + group
    const exercises = await Exercise.find({
      userId: req.user.id,
      muscleGroup
    }).sort({ createdAt: -1 });

    // For each exercise, fetch last log and max weight
    const enriched = await Promise.all(
      exercises.map(async (ex) => {
        // Get last log
        const lastLog = await ExerciseLog.findOne({
          userId: req.user.id,
          exerciseId: ex._id
        }).sort({ date: -1 });

        // Get max weight across all logs
        const maxWeightAgg = await ExerciseLog.aggregate([
          { $match: { userId: req.user._id, exerciseId: ex._id } },
          { $unwind: "$sets" },
          { $group: { _id: null, maxWeight: { $max: "$sets.weight" } } }
        ]);

        return {
          _id: ex._id,
          exerciseName: ex.exerciseName,
          muscleGroup: ex.muscleGroup,
          lastLog: lastLog || null,
          maxWeight: maxWeightAgg.length > 0 ? maxWeightAgg[0].maxWeight : null,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get exercises by muscle group (id + value only)
export const getExercises = async (req, res) => {
  try {
    const { muscleGroup } = req.params;

    const exercises = await Exercise.find({
      userId: req.user.id,
      muscleGroup
    })
      .sort({ createdAt: -1 })
      .select("_id exerciseName"); // Only fetch id + name

    const formatted = exercises.map(ex => ({
      id: ex._id,
      value: ex.exerciseName,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Add new exercise under muscle group
export const addExercise = async (req, res) => {
  try {
    const { muscleGroup, exerciseName } = req.body;
    const existing = await Exercise.findOne({
      userId: req.user.id,
      muscleGroup,
      exerciseName: { $regex: new RegExp(`^${exerciseName}$`, "i") } // case-insensitive
    });
    if (existing) {
      return res.status(400).json({ message: "Exercise with this name already exists in this muscle group" });
    }
    const exercise = new Exercise({
      userId: req.user.id,
      muscleGroup,
      exerciseName
    });
    await exercise.save();
    res.status(201).json({ message: "Exercise added", data: exercise });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Delete exercise
export const deleteExercise = async (req, res) => {
  try {
    const deleted = await Exercise.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Exercise deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Create exercise log (for a specific exercise)
export const addExerciseLog = async (req, res) => {
  try {
    const { exerciseId, sets, date } = req.body;

    const log = new ExerciseLog({
      userId: req.user.id,
      exerciseId,
      sets,
      date: date || new Date()
    });
    await log.save();

    res.status(201).json({ message: "Exercise log added", data: log });
    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all logs for an exercise (with optional date range)
export const getExerciseLogs = async (req, res) => {
  try {
    const { start, end, exerciseId } = req.query;

    if (!exerciseId) {
      return res.status(400).json({ message: "ExerciseId is required" });
    }

    const query = {
      userId: req.user.id,
      exerciseId,
    };

    // Apply date filter if provided
    if (start && end) {
      query.date = {
        $gte: new Date(start),
        $lte: new Date(new Date(end).setHours(23, 59, 59, 999)),
      };
    }

    const logs = await ExerciseLog.find(query)
      .sort({ date: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update log
export const updateExerciseLog = async (req, res) => {
  try {
    const updatedLog = await ExerciseLog.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    res.json({ message: "Exercise log updated", data: updatedLog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Delete log
export const deleteExerciseLog = async (req, res) => {
  try {
    const deleted = await ExerciseLog.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Exercise log deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get exercise progress (charts)
export const getExerciseProgress = async (req, res) => {
  try {
    const { start, end, exerciseId } = req.query;
    if (!exerciseId) {
      return res.status(400).json({ message: "ExerciseId is required" });
    }

    const match = {
      userId: new mongoose.Types.ObjectId(req.user.id),
      exerciseId: new mongoose.Types.ObjectId(exerciseId)
    };

    if (start && end) {
      match.date = {
        $gte: new Date(start),
        $lte: new Date(new Date(end).setHours(23, 59, 59, 999))
      };
    }

    const progress = await ExerciseLog.aggregate([
      { $match: match },
      { $unwind: "$sets" },
      {
        $group: {
          _id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } } },
          avgWeight: { $avg: "$sets.weight" },
          avgReps: { $avg: "$sets.reps" },
          totalVolume: { $sum: { $multiply: ["$sets.weight", "$sets.reps"] } },
          maxWeight: { $max: "$sets.weight" }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
