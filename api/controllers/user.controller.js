import Listing from "../models/listing.model.js";
import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import mongoose from 'mongoose';

export const updateUser = async (req, res) => {

    if (req.user.id != req.params.id) {
        return res.status(401).json("You can only update your own account.")
    }
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    name: req.body.name,
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                },
            },
            { new: true }
        );

        const { password, ...rest } = updatedUser._doc;

        res.status(200).json(rest);
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.email) {
            // Handle duplicate email error
            res.status(409).json("Email is already registered");
            // Similarly, respond to the user with an appropriate message.
        }
        else if (error.code === 11000 && error.keyPattern.username) {
            // Handle duplicate email error
            res.status(408).json("Username not available");
            // Similarly, respond to the user with an appropriate message.
        } else {
            // Handle other errors
            console.error("An error occurred:", error);
            // You might want to respond with a generic error message in this case.
        }
    }
};


export const deleteUser = async (req, res) => {
    if (req.user.id !== req.params.id) {
        return res.status().json("You can only delete your own account!")
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json("User delete successfully!")
    }
    catch (error) {
        console.log("An error occured: ", error);

    }
}

export const getUserListings = async (req, res) => {
    if (req.user.id === req.params.id) {
        try {
            const listings = await Listing.find({ userRef: req.params.id });
            res.status(200).json(listings);
        }
        catch (error) {
            res.status(500).json("Internal Server Error")
        }
    }
    else {
        res.status(401).json("You can only view your own listings.")
    }
}

export const getNotificationNumber = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        // Count chats where the user is a participant but hasn't seen them yet
        const number = await Chat.countDocuments({
            userIDs: { $in: [tokenUserId] },
            seenBy: { $nin: [tokenUserId] },
        });

        res.status(200).json(number);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get notification number!" });
    }
};

export const getUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Validate ObjectId if using MongoDB
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Fetch user and exclude the password field
        const user = await User.findById(userId).select('-password'); // Excludes 'password' field

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(user); // Log user details for debugging
        res.status(200).json(user); // Send user details
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Server error' });
    }
};
