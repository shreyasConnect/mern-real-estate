import Listing from "../models/listing.model.js";
import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'

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