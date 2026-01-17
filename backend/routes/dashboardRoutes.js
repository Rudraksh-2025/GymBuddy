import express from "express";
import { auth } from '../middleware/authMiddleware.js'
import { getDashboardSummary } from "../controllers/dashboardController.js";
const router = express.Router()

router.get("/", auth, getDashboardSummary)

export default router