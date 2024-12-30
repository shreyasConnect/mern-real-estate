import mongoose from 'mongoose';
const MessageSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true
        },
        text: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', required: true
        },
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat', required: true
        },
    },
    { timestamps: true }
);

const Message = mongoose.model('Message', MessageSchema);
export default Message;