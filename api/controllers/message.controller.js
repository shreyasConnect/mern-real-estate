import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";


export const addMessage = async (req, res) => {
    const tokenUserId = req.userId;
    const chatId = req.params.chatId;
    const text = req.body.text;

    try {
        // Check if the chat exists and the user is a participant
        const chat = await Chat.findOne({
            _id: chatId,
            userIDs: tokenUserId, // Ensure the user is part of the chat
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found!" });
        }

        // Create a new message
        const message = new Message({
            text,
            chatId,
            userId: tokenUserId,
            createdAt: new Date(),
        });

        await message.save();

        // Update the chat with the last message and mark as seen
        chat.lastMessage = text;
        chat.seenBy = [tokenUserId]; // Reset the seenBy array to only the sender
        await chat.save();

        res.status(201).json(message);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add message!" });
    }
};
