// controllers/friendController.js
import User from "../models/User.js";

export const addFriend = async (req, res) => {
    const userId = req.user.id;
    const { code } = req.body;

    const friend = await User.findOne({ friendCode: code });
    if (!friend)
        return res.status(404).json({ message: "Invalid friend code" });

    if (friend._id.equals(userId))
        return res.status(400).json({ message: "Cannot add yourself" });

    await User.updateOne(
        { _id: userId },
        { $addToSet: { friends: friend._id } }
    );

    await User.updateOne(
        { _id: friend._id },
        { $addToSet: { friends: userId } }
    );

    res.json({ message: "Friend added successfully" });
};
export const getFriends = async (req, res) => {
    const user = await User.findById(req.user.id)
        .populate("friends", "name xp rank streak lastActiveDate");

    res.json(user.friends);
};

export const getFriendLeaderboard = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select("friends xp streak rank lastWorkout");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Include self + friends
        const leaderboardUsers = await User.find({
            _id: { $in: [...user.friends, userId] },
        })
            .select("name xp streak rank lastWorkout")
            .sort({ xp: -1 });

        // ---------- FORMAT DATA ----------
        const formatted = leaderboardUsers.map((u, index) => ({
            id: u._id,
            position: index + 1,
            name: u.name,
            isYou: u._id.toString() === userId,
            xp: u.xp || 0,
            rank: u.rank || "Rookie",
            streak: u.streak || 0,
            lastWorkout: u.lastWorkout || "—",
        }));

        // ---------- PODIUM (TOP 3) ----------
        const podium = formatted.slice(0, 3);

        res.json({
            success: true,
            data: {
                podium,          // for top cards
                leaderboard: formatted, // full table
                yourRank: formatted.find(f => f.isYou)?.position || null,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to load leaderboard" });
    }
};
