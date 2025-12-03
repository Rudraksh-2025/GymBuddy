import dotenv from 'dotenv';
dotenv.config();


import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import weightRoutes from "./routes/weightRoutes.js"
import exerciseRoutes from './routes/exerciseRoutes.js'
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3001' // Allow requests from your frontend
}));
app.use('/api/auth', authRoutes);
app.use("/api/weight", weightRoutes);
app.use('/api/exercises', exerciseRoutes)

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
