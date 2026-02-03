// foodRoutes.js
import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { addFriend, getFriendLeaderboard, getFriends } from "../controllers/FriendController.js";

const router = express.Router();
router.get("/", auth, getFriendLeaderboard);
router.post("/", auth, addFriend);
export default router;