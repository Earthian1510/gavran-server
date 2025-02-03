const jwt = require('jsonwebtoken');
require('dotenv').config();

const protectedRoute = (req, res, next) => {
    const token = req.headers["authorization"];
    
    if (!token) {
        return res.status(401).json({ message: "No token provided." });
    }

    const bearerToken = token.split(' ')[1];
    if (!bearerToken) {
        return res.status(401).json({ message: "Malformed token." });
    }

    try {
        const decodedToken = jwt.verify(bearerToken, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token." });
    }
}

module.exports = protectedRoute;

