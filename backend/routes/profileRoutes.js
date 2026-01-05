import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { auth } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.get("/", auth, getProfile);
router.put("/", auth, upload.single("profilePhoto"), updateProfile);

export default router;
