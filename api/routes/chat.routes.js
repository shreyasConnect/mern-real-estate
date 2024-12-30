import express from 'express';
import {
    getChats,
    getChat,
    addChat,
    readChat,
} from "../controllers/chat.controller.js";
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get("/chat", verifyToken, getChats);
router.get("/chat/:id", verifyToken, getChat);
router.post("/chat", verifyToken, addChat);
router.put("/chat/read/:id", verifyToken, readChat);

export default router;
