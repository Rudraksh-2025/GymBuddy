import express from 'express'
import { auth } from '../middleware/authMiddleware.js'
import { aiChat } from '../controllers/aiChat.js'
const router = express.Router()

router.post("/chat", auth, aiChat);

export default router;