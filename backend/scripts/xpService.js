import User from "../models/User.js";
import { getRankByXP } from "../config/rank.js";

const DAILY_XP_CAP = 120;

export const addXP = async (userId, amount, reason) => {
    const user = await User.findById(userId);
    if (!user) return;

    const today = new Date().toDateString();

    if (user.lastActiveAt?.toDateString() !== today) {
        user.dailyXP = 0;
        user.lastActiveAt = new Date();
    }

    if (user.dailyXP >= DAILY_XP_CAP) return;

    const xpToAdd = Math.min(amount, DAILY_XP_CAP - user.dailyXP);

    user.xp = (user.xp || 0) + xpToAdd;
    user.dailyXP = (user.dailyXP || 0) + xpToAdd;
    user.rank = getRankByXP(user.xp);

    await user.save();

    console.log(`+${xpToAdd} XP | ${reason}`);
};
