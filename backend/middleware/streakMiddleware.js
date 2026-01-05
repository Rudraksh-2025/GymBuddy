// middleware/streakMiddleware.js
import User from "../models/User.js";

const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

const diffInDays = (d1, d2) =>
    Math.floor((d1 - d2) / (1000 * 60 * 60 * 24));

export const updateStreak = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return next();

        const user = await User.findById(userId).select("streak lastActiveAt");
        if (!user) return next();

        const now = new Date();

        // First ever activity
        if (!user.lastActiveAt) {
            user.streak = 1;
            user.lastActiveAt = now;
            await user.save();
            return next();
        }

        // Same day → no change
        if (isSameDay(now, user.lastActiveAt)) {
            return next();
        }

        const daysDiff = diffInDays(now, user.lastActiveAt);

        // Yesterday → increment streak
        if (daysDiff === 1) {
            user.streak += 1;
        }
        // Missed one or more days → reset
        else {
            user.streak = 1;
        }

        user.lastActiveAt = now;
        await user.save();

        next();
    } catch (err) {
        console.error("Streak middleware error:", err);
        next(); // do NOT block API
    }
};
