import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        userIDs: [{
            type: mongoose.Schema.Types.ObjectId
        }],
        seenBy: [{
            type: mongoose.Schema.Types.ObjectId
        }],
        messages: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }],
        lastMessage: {
            type: String
        },
    },
    { timestamps: true }
);

const Chat = mongoose.model('Chat', ChatSchema);

export default Chat;