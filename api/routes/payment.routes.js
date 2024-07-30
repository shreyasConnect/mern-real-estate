import express from "express";
import {
    checkout,
    getKey,
    paymentVerification,
    premiumStatus
} from "../controllers/payment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/checkout/:amount/:id", checkout);

router.post("/paymentverification/:amount", verifyToken, paymentVerification);

router.get("/getkey", getKey);

router.get("/premium/:id", premiumStatus);

export default router;
