import express from 'express'
import { auth } from '../middleware/authMiddleware.js'
import { aiChat, getInsights } from '../controllers/aiChat.js'
const router = express.Router()

router.post("/chat", auth, aiChat);
router.get('/insight', auth, getInsights)

export default router;