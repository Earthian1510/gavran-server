const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserDBG = require('../models/user.model')
const protectedRoute = require('../middleware/protectedRoute')
require('dotenv').config()

const router = express.Router()

// Function : Hash Password 
const hashPassword = async (password) => {
    return bcrypt.hash(password, 10)
}
// Function : Compare Password 
const comparePassword = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
}
// Function : Generate Token
const generateToken = (userId, role) => {
    const payload = { userId, role }
    const secret = process.env.JWT_SECRET
    return jwt.sign(payload, secret, { expiresIn: '24hr' })
}

// User signup
router.post("/user/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await UserDBG.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "email already registered" })
        }
        const hashedPassword = await hashPassword(password);
        const newUser = new UserDBG({
            name,
            email,
            password: hashedPassword,
            userImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhAq96S4rzot47qiaT2Q65A3Jc3vLAUaKWKA&s'
        })

        await newUser.save()
        res.status(201).json({ message: "user registration successful.", user: newUser })

    }
    catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error", error })
    }
})

// User login
router.post('/user/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserDBG.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials - Email doesnt exist" })
        }

        const isMatch = await comparePassword(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials - Password dont Match" })
        }

        const token = generateToken(user._id, user.role);
    
        res.status(200).json({ message: "Login successful", token })

    }
    catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error", error })
    }
})

module.exports = router 
