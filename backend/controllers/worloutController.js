// controllers/exerciseController.js
import ExerciseLog from "../models/ExerciseLog.js";

// Add log
export const addExerciseLog = async (req, res) => {
  try {
    const { exerciseName, sets, date } = req.body;
    const log = new ExerciseLog({
      userId: req.user.id,
      exerciseName,
      sets,
      date: date || new Date()
    });
    await log.save();
    res.status(201).json({ message: "Exercise log added", data: log });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get logs (with optional date range & exercise filter)
export const getExerciseLogs = async (req, res) => {
  try {
    const { start, end, exerciseName } = req.query;
    let filter = { userId: req.user.id };

    if (start && end) {
      filter.date = { $gte: new Date(start), $lte: new Date(end) };
    }
    if (exerciseName) {
      filter.exerciseName = exerciseName;
    }

    const logs = await ExerciseLog.find(filter).sort({ date: 1 });
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
    await ExerciseLog.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Exercise log deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// controllers/exerciseController.js (extra)
export const getExerciseProgress = async (req, res) => {
    try {
      const { start, end, exerciseName } = req.query;
      if (!exerciseName) {
        return res.status(400).json({ message: "Exercise name is required" });
      }
  
      let match = { userId: req.user.id, exerciseName };
  
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
            totalVolume: { $sum: { $multiply: ["$sets.weight", "$sets.reps"] } }
          }
        },
        { $sort: { "_id.date": 1 } }
      ]);
  
      res.json(progress);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  