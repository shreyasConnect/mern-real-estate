import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from "./routes/auth.routes.js";
import userRouter from './routes/user.routes.js';
import listingRouter from './routes/listing.routes.js';
import paymentRouter from './routes/payment.routes.js';
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";
import { connectDB } from "./config/database.js";
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());

connectDB();

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_APT_SECRET,
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/listing', listingRouter)
app.use('/api/payment', paymentRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT} !`)
});