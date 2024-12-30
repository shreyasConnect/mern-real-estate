import { instance } from "../index.js";
import crypto from "crypto";
import { Payment } from "../models/payment.model.js";
import dotenv from "dotenv";
dotenv.config();

export const getKey = async (req, res) => {
    try {
        res.status(200).json(process.env.RAZORPAY_API_KEY)
        console.log("success!")
    } catch (error) {
        console.log(error)
    }
}

export const checkout = async (req, res) => {
    const options = {
        amount: Number(req.params.amount * 100),
        currency: "INR",
    };
    const order = await instance.orders.create(options);

    res.status(200).json(order);
};

export const paymentVerification = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

    const user_id = req.user.id;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    const subscriptionDurations = {
        399: 30,
        2094: 180,
        3588: 365
    };
    const durationInDays = subscriptionDurations[req.params.amount];

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationInDays);


    if (isAuthentic) {

        await Payment.create({
            user_id,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            subscription_start_date: startDate,
            subscription_end_date: endDate
        });

        res.status(200).json("Payment Successful!")

    } else {
        res.status(400).json("Payment Unsuccessfull!");
    }
};

export const premiumStatus = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await Payment.findOne({ user_id: userId });;


        if (!user) {
            return res.status(404);
        }
        const startDate = user.subscription_start_date;
        const endDate = user.subscription_end_date;

        const currentDate = new Date();
        const isPremium = currentDate >= startDate && currentDate <= endDate;



        if (isPremium) {
            res.status(200).json("Success");
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json('Internal Server Error');
    }
}
