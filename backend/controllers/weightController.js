// controllers/weightController.js
import Weight from "../models/Weight.js";

// Add new weight entry
export const addWeight = async (req, res) => {
  try {
    const { weight } = req.body;
    if (!weight) {
      return res.status(400).json({ message: "Weight is required" });
    }
    const newWeight = new Weight({
      userId: req.user.id,
      weight
    });

    await newWeight.save();
    res.status(201).json({ message: "Weight added successfully", data: newWeight });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get weight history with optional date range + change calculation
export const getWeightHistory = async (req, res) => {
  try {
    const { start, end } = req.query;
    let filter = { userId: req.user.id };

    if (start && end) {
      filter.createdAt = {
        $gte: new Date(start),
        $lte: new Date(end)
      };
    }

    const history = await Weight.find(filter).sort({ createdAt: 1 });

    if (history.length === 0) {
      return res.json({
        data: [],
        change: 0,
        changePercent: 0
      });
    }

    const firstWeight = history[0].weight;
    const lastWeight = history[history.length - 1].weight;

    const change = lastWeight - firstWeight;
    const changePercent = ((change / firstWeight) * 100).toFixed(2);

    res.json({
      data: history,
      change,
      changePercent: Number(changePercent)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
