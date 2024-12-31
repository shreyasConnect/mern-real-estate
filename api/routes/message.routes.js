import express from 'express';
import { sendMessage, getMessages, getUserBySearch, getCorrentChatters } from '../controllers/message.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/send/:id', verifyToken, sendMessage)
router.get('/get/:id', verifyToken, getMessages);
router.get('/search', verifyToken, getUserBySearch);
router.get('/currentchatters', verifyToken, getCorrentChatters)



export default router;
