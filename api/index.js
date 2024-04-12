import { error } from "console";
import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from "./routes/auth.routes.js";
dotenv.config();

const app = express();

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
