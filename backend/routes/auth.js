import express from 'express'
const router = express.Router();
import * as authController from '../controllers/authControllers.js';


router.post('/register', authController.register);
router.post('/verify-email', authController.verifyOtp);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

export default router;
