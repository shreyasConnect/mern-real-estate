
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReciverSocketId, io } from "../Socket/socket.js";
import mongoose from "mongoose";

export const sendMessage = async (req, res) => {
    try {
        const { messages } = req.body;
        const { id: reciverId } = req.params;
        const senderId = req.user.id;


        let chats = await Conversation.findOne({
            participants: { $all: [senderId, reciverId] }
        })

        if (!chats) {
            chats = await Conversation.create({
                participants: [senderId, reciverId],
            })
        }

        const newMessages = new Message({
            senderId,
            reciverId,
            message: messages,
            conversationId: chats._id
        })

        if (newMessages) {
            chats.messages.push(newMessages._id);
        }

        await Promise.all([chats.save(), newMessages.save()]);

        //SOCKET.IO function 
        const reciverSocketId = getReciverSocketId(reciverId);
        if (reciverSocketId) {
            io.to(reciverSocketId).emit("newMessage", newMessages)
        }

        console.log(newMessages)

        res.status(201).json(newMessages)

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(`error in sendMessage ${error}`);
    }
}


export const getMessages = async (req, res) => {
    try {
        const { id: reciverId } = req.params;
        const senderId = req.user.id;

        console.log("reciverId", reciverId, "senderId", senderId);

        // Convert to ObjectId
        const senderObjectId = new mongoose.Types.ObjectId(senderId);  // Use new here
        const reciverObjectId = new mongoose.Types.ObjectId(reciverId);  // Use new here

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(senderObjectId) || !mongoose.Types.ObjectId.isValid(reciverObjectId)) {
            return res.status(400).send({
                success: false,
                message: "Invalid sender or receiver ID.",
            });
        }

        // Fetch conversation with both sender and receiver ObjectIds
        const chats = await Conversation.findOne({
            participants: { $all: [senderObjectId, reciverObjectId] }
        }).populate("messages");

        if (!chats) return res.status(200).send([]);

        const message = chats.messages;
        res.status(200).send(message);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
        console.log(`Error in getMessages: ${error}`);
    }
};


export const getCorrentChatters = async (req, res) => {
    try {
        const currentUserID = req.user.id;
        const currenTChatters = await Conversation.find({
            participants: currentUserID
        }).sort({
            updatedAt: -1
        });


        if (!currenTChatters || currenTChatters.length === 0) return res.status(200).send([]);

        const partcipantsIDS = currenTChatters.reduce((ids, conversation) => {
            const otherParticipents = conversation.participants.filter(id => id !== currentUserID);
            return [...ids, ...otherParticipents]
        }, [])

        const otherParticipentsIDS = partcipantsIDS.filter(id => id.toString() !== currentUserID.toString());

        const user = await User.find({ _id: { $in: otherParticipentsIDS } }).select("-password").select("-email");

        const users = otherParticipentsIDS.map(id => user.find(user => user._id.toString() === id.toString()));
        console.log(users)

        res.status(200).send(users)

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}

export const getUserBySearch = async (req, res) => {
    try {
        const search = req.query.search || '';
        const currentUserID = req.user.id;

        console.log("currentuserid: ", currentUserID);
        console.log("object: ", search);
        const user = await User.find({
            $and: [
                {
                    $or: [
                        { username: { $regex: '.*' + search + '.*', $options: 'i' } },
                        { name: { $regex: '.*' + search + '.*', $options: 'i' } }
                    ]
                }, {
                    _id: { $ne: currentUserID }
                }
            ]
        }).select("-password").select("email")

        console.log("user", user);

        res.status(200).json(user)

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}

