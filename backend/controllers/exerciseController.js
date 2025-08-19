// controllers/exerciseController.js
import ExerciseLog from "../models/Workout.js";
import Exercise from "../models/Exercise.js";


// Get exercises by muscle group
export const getExercisesByGroup = async (req, res) => {
  try {
    const { muscleGroup } = req.params;
    const exercises = await Exercise.find({
      userId: req.user.id,
      muscleGroup
    }).sort({ createdAt: -1 });

    res.json(exercises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Add new exercise under muscle group
export const addExercise = async (req, res) => {
  try {
    const { muscleGroup, exerciseName } = req.body;
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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get all logs for an exercise
export const getExerciseLogs = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const logs = await ExerciseLog.find({
      userId: req.user.id,
      exerciseId
    }).sort({ date: -1 });

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

    let match = { userId: req.user.id, exerciseId };

    if (start && end) {
      match.date = { $gte: new Date(start), $lte: new Date(end) };
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
