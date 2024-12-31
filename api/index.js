import express from "express";
import colors from 'colors';
import path from "path";
import dotenv from 'dotenv';
import authRouter from "./routes/auth.routes.js";
import userRouter from './routes/user.routes.js';
import listingRouter from './routes/listing.routes.js';
import paymentRouter from './routes/payment.routes.js';
import messageRouter from './routes/message.routes.js';
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";
import { connectDB } from "./config/database.js";
import { app, server } from './Socket/socket.js'
dotenv.config();

const __dirname = path.resolve();

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
app.use('/api/message', messageRouter);

app.use(express.static(path.join(__dirname, "/frontend/dist")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "index.html"))
})

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT} !`.yellow.bold)
});