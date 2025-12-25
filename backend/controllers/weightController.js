// controllers/weightController.js
import Weight from "../models/Weight.js";

// Add new weight entry
export const addWeight = async (req, res) => {
  try {
    const { weight, date } = req.body;

    if (weight == null || !date) {
      return res.status(400).json({
        success: false,
        message: "Weight and date are required",
      });
    }

    const userId = req.user.id;
    const entryDate = new Date(date);

    // Find previous entry BEFORE this date
    const previousEntry = await Weight.findOne({
      userId,
      date: { $lt: entryDate },
    }).sort({ date: -1 });

    const change = previousEntry
      ? Number((weight - previousEntry.weight).toFixed(2))
      : 0;

    const newWeight = await Weight.create({
      userId,
      date: entryDate,
      weight,
      change,
    });

    res.status(201).json({
      success: true,
      message: "Weight added successfully",
      data: newWeight,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Failed to add weight",
    });
  }
};


// Get weight history with optional date range + change calculation
export const getWeightHistory = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const filter = { userId };

    if (req.query.startDate && req.query.endDate) {
      filter.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    const [weights, totalCount] = await Promise.all([
      Weight.find(filter)
        .sort({ date: -1 }) // latest first
        .skip(skip)
        .limit(limit),
      Weight.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: weights,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch weight tracking data",
    });
  }
};


export const deleteWeight = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const weightEntry = await Weight.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!weightEntry) {
      return res.status(404).json({
        success: false,
        message: "Weight entry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Weight entry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete weight entry",
    });
  }
};


export const getWeightSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const TARGET_WEIGHT = 66;

    const weights = await Weight.find({ userId }).sort({ date: 1 });

    if (weights.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          targetWeight: { value: TARGET_WEIGHT, change: { percentage: 0, flag: "up" } },
          weightLeft: { value: 0, change: { percentage: 0, flag: "down" } },
          totalLost: { value: 0, change: { percentage: 0, flag: "up" } },
          bodyFat: { value: 0, change: { percentage: 0, flag: "down" } }
        }
      });
    }

    const currentWeight = weights[weights.length - 1].weight;
    const startWeight = weights[0].weight;

    /* ---------------- DATE WINDOWS ---------------- */
    const latestDate = weights[weights.length - 1].date;

    const thisWeekStart = new Date(latestDate);
    thisWeekStart.setDate(thisWeekStart.getDate() - 7);

    const lastWeekStart = new Date(latestDate);
    lastWeekStart.setDate(lastWeekStart.getDate() - 14);

    const thisWeek = weights.filter(w => w.date >= thisWeekStart);
    const lastWeek = weights.filter(
      w => w.date >= lastWeekStart && w.date < thisWeekStart
    );

    /* ---------------- HELPERS ---------------- */
    const avg = arr =>
      arr.length ? arr.reduce((s, w) => s + w.weight, 0) / arr.length : 0;

    const percentChange = (current, previous) =>
      previous ? Number((((current - previous) / previous) * 100).toFixed(2)) : 0;

    /* ---------------- METRICS ---------------- */
    const totalLost = Number((startWeight - currentWeight).toFixed(2));
    const weightLeft = Number((currentWeight - TARGET_WEIGHT).toFixed(2));

    const thisWeekAvg = avg(thisWeek);
    const lastWeekAvg = avg(lastWeek);

    const totalLostLastWeek =
      lastWeek.length > 0 ? startWeight - lastWeek[lastWeek.length - 1].weight : 0;

    /* ---------------- CHANGES ---------------- */
    const weightLeftChange = percentChange(weightLeft, lastWeekAvg - TARGET_WEIGHT);
    const totalLostChange = percentChange(totalLost, totalLostLastWeek);
    const bodyFatChange = percentChange(19.79, 19.79 + 0.3); // placeholder logic

    res.status(200).json({
      success: true,
      data: {
        targetWeight: {
          value: TARGET_WEIGHT,
          change: { percentage: 0, flag: "up" }
        },
        weightLeft: {
          value: weightLeft > 0 ? weightLeft : 0,
          change: {
            percentage: Math.abs(weightLeftChange),
            flag: weightLeftChange <= 0 ? "down" : "up"
          }
        },
        totalLost: {
          value: totalLost > 0 ? totalLost : 0,
          change: {
            percentage: Math.abs(totalLostChange),
            flag: totalLostChange >= 0 ? "up" : "down"
          }
        },
        bodyFat: {
          value: 19.79,
          change: {
            percentage: Math.abs(bodyFatChange),
            flag: bodyFatChange <= 0 ? "down" : "up"
          }
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch weight analytics"
    });
  }
};


