import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    const { name, username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ name, username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json('User created successfully!')
    }
    catch (error) {
        if (error.code === 11000 && error.keyPattern.username) {
            // Handle duplicate username error
            res.status(409).json("Username is already taken.");
            // You can respond to the user appropriately, like sending an error message back to the signup form.
        } else if (error.code === 11000 && error.keyPattern.email) {
            // Handle duplicate email error
            res.status(409).json("Email is already registered.");
            // Similarly, respond to the user with an appropriate message.
        } else {
            // Handle other errors
            console.error("An error occurred:", error);
            // You might want to respond with a generic error message in this case.
        }
    }
}

export const signin = async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    try {
        let validUser;
        // Check if the input is an email address
        validUser = await User.findOne({ email: usernameOrEmail });

        // If the input is not an email, check if it's a username
        if (!validUser) {
            validUser = await User.findOne({ username: usernameOrEmail });
        }

        // If no user is found, return appropriate error message
        if (!validUser) {
            return res.status(404).json("User not found!");
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            res.status(401).json("Wrong Credentials!")
        }
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        res.cookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'Strict' })
            .status(200)
            .json(rest);
    }
    catch (error) {
        console.log(error);
    }
};

export const google = async (req, res) => {
    const { name, email, photo } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {  //if user already exists, then registration
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            res.cookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'Strict' })
                .status(200)
                .json(rest);
        }
        else { //the user is registering
            // Extract username from email by taking characters before '@'
            const username = email.split('@')[0];

            // Generate a random 6-digit number
            const randomNumber = Math.floor(100000 + Math.random() * 900000);

            // Append the random number to the username
            const uniqueUsername = `${username}${randomNumber}`;

            // Check if the username already exists
            let isUnique = false;
            let finalUsername = uniqueUsername;

            while (!isUnique) {
                // Check if the username already exists in the database
                const existingUser = await User.findOne({ username: finalUsername });

                // If the username doesn't exist, it's unique
                if (!existingUser) {
                    isUnique = true;
                } else {
                    // If the username exists, append a random number to make it unique
                    finalUsername = `${username}${Math.floor(100000 + Math.random() * 900000)}`;
                }
            }

            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
            const newUser = new User({
                name, username: finalUsername, email, password: hashedPassword, avatar: photo
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password, ...rest } = newUser._doc;
            res.cookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'Strict' })
                .status(200)
                .json(rest);

        }
    }
    catch (error) {
        if (error.code === 11000 && error.keyPattern.email) {
            // Handle duplicate email error
            res.status(409).json("Email is already registered.");
            // Similarly, respond to the user with an appropriate message.
        } else {
            // Handle other errors
            console.error("An error occurred:", error);
            // You might want to respond with a generic error message in this case.
        }
    }

}

export const signOut = async (req, res) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json("User has been logged out!");
    }
    catch (error) {
        console.log("An error occured: ", error);
    }
}
