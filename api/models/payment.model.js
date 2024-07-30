import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    user_id: {
        type: String,
        require: true,
    },
    razorpay_order_id: {
        type: String,
        required: true,
    },
    razorpay_payment_id: {
        type: String,
        required: true,
    },
    razorpay_signature: {
        type: String,
        required: true,
    },
    subscription_start_date: {
        type: Date,
        required: true,
    },
    subscription_end_date: {
        type: Date,
        required: true,
    }
});

export const Payment = mongoose.model("Payment", paymentSchema);
