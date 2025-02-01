const jwt = require('jsonwebtoken')
require('dotenv').config()

const protectedRoute = (req, res, next) => {
    const token = req.headers["authorization"]
    if(!token){
        return res.status(401).json({ message: "No token provided."})
    }

    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next()
    }
    catch(error){
        return res.status(402).json({ message: "Invalid Token"})
    }    
}

module.exports = protectedRoute;