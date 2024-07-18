import express from "express";
import {
    checkout,
    getKey,
    paymentVerification,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/checkout/:amount", checkout);

router.post("/paymentverification", paymentVerification);

router.get("/getkey", getKey);

export default router;
