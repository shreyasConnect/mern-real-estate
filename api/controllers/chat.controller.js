import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";


// Get all chats for the authenticated user
export const getChats = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        const chats = await Chat.find({
            userIDs: tokenUserId, // Find chats where the user is a participant
        }).populate({
            path: "messages",
            options: { sort: { createdAt: 1 } },
        });

        // Add receiver information to each chat
        for (const chat of chats) {
            const receiverId = chat.userIDs.find((id) => id.toString() !== tokenUserId);

            const receiver = await User.findById(receiverId).select("id username avatar");

            chat.receiver = receiver;
        }

        res.status(200).json(chats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get chats!" });
    }
};

// Get a specific chat with its messages
export const getChat = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        const chat = await Chat.findOne({
            _id: req.params.id,
            userIDs: tokenUserId, // Ensure the user is part of the chat
        }).populate({
            path: "messages",
            options: { sort: { createdAt: 1 } },
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found!" });
        }

        // Mark chat as seen
        if (!chat.seenBy.includes(tokenUserId)) {
            chat.seenBy.push(tokenUserId);
            await chat.save();
        }

        res.status(200).json(chat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get chat!" });
    }
};

// Add a new chat
export const addChat = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        const newChat = new Chat({
            userIDs: [tokenUserId, req.body.receiverId],
            seenBy: [],
        });

        await newChat.save();
        res.status(201).json(newChat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add chat!" });
    }
};

// Mark a chat as read
export const readChat = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        const chat = await Chat.findOneAndUpdate(
            {
                _id: req.params.id,
                userIDs: tokenUserId, // Ensure the user is part of the chat
            },
            {
                $addToSet: { seenBy: tokenUserId }, // Add user to `seenBy` array if not already present
            },
            { new: true }
        );

        if (!chat) {
            return res.status(404).json({ message: "Chat not found!" });
        }

        res.status(200).json(chat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to read chat!" });
    }
};
