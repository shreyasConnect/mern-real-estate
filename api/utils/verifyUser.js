import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];;
    if (!token) return res.status(401).json("Unauthorised!")

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json("Forbidden!")

        req.user = user;
        console.log(req.user.id);

        next();
    });
};