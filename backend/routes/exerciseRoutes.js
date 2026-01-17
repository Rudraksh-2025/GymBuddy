// routes/exerciseRoutes.js
import express from "express";
import {
  addExerciseLog,
  getExerciseLogs,
  updateExerciseLog,
  deleteExerciseLog,
  getExerciseProgress,
  getExercisesByGroup,
  addExercise,
  deleteExercise,
  getExercises
} from "../controllers/exerciseController.js";
import { auth } from "../middleware/authMiddleware.js";
import { upload } from '../middleware/upload.js'

const router = express.Router();

router.get('/group/:muscleGroup', auth, getExercisesByGroup);
router.get('/exercise/:muscleGroup', auth, getExercises)
router.post('/exercise/', auth, upload.single("image"), addExercise)
router.delete('/exercise/:id', auth, deleteExercise)
router.post("/", auth, addExerciseLog);
router.get("/logs", auth, getExerciseLogs);
router.put("/:id", auth, updateExerciseLog);
router.delete("/:id", auth, deleteExerciseLog);
router.get('/progress', auth, getExerciseProgress)

export default router;
