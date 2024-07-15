import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from "./routes/auth.routes.js";
import userRouter from './routes/user.routes.js';
import listingRouter from './routes/listing.routes.js';
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(cookieParser());
mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((error) => {
        console.log(error)
    });

app.use(express.json());


app.listen(3000, () => {
    console.log("Server running on port 3000!")
})

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/listing', listingRouter)
