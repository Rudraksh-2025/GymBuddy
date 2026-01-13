import dotenv from 'dotenv';
dotenv.config();


import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import weightRoutes from "./routes/weightRoutes.js"
import exerciseRoutes from './routes/exerciseRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import foodRoutes from './routes/foodRoutes.js'
import foodLogRoutes from './routes/foodLogRoutes.js'
import cors from 'cors'
import { auth } from './middleware/authMiddleware.js';
import { updateStreak } from './middleware/streakMiddleware.js'
const app = express();
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:3001",
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // Postman / server-to-server
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("CORS not allowed for this origin"));
    },
    credentials: true
}));

app.use('/api/auth', authRoutes);
// 🔐 Auth middleware
app.use(auth);

// 🔥 Streak middleware (AFTER auth)
app.use(updateStreak);
app.use('/api/food', foodRoutes)
app.use("/api/weight", weightRoutes);
app.use('/api/exercises', exerciseRoutes)
app.use("/api/profile", profileRoutes);
app.use('/api/foodLog', foodLogRoutes)


app.get('/', (req, res) => res.send('Auth API running'));

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongo connected');
        app.listen(PORT, () => console.log(`Server started on ${PORT}`));
    })
    .catch(err => {
        console.error('DB connection error', err);
    });
