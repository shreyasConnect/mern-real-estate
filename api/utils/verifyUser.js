import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    console.log("token:", token)
    if (!token) return res.status(401).json("Unauthorised!")

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json("Forbidden!")

        req.user = user;

        next();
    });
};