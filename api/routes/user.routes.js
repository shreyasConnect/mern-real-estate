import express from "express";
import { deleteUser, getUserListings, updateUser, getNotificationNumber } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/:id', verifyToken, getUserListings)
router.get("/notification", verifyToken, getNotificationNumber);



export default router;