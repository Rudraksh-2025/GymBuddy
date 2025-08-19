// routes/exerciseRoutes.js
import express from "express";
import {
  addExerciseLog,
  getExerciseLogs,
  updateExerciseLog,
  deleteExerciseLog,
  getExerciseProgress
} from "../controllers/exerciseController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, addExerciseLog);
router.get("/", auth, getExerciseLogs);
router.put("/:id", auth, updateExerciseLog);
router.delete("/:id", auth, deleteExerciseLog);
router.get('/progress', auth, getExerciseProgress)

export default router;
