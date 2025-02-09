const express = require('express')
const UserDBG = require('../models/user.model')
const protectedRoute = require('../middleware/protectedRoute')
const router = express.Router()

router.use(protectedRoute)

router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await UserDBG.findOne({ _id: userId })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json(user)
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error fetching user information" })
    }
})

router.get('/users', async (req, res) => {
    try {
        const allUsers = await UserDBG.find();
        res.status(200).json(allUsers);
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error fetching users" });
    }
})

router.put('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    const userData = req.body;
    try{
        const user = await UserDBG.findByIdAndUpdate(
            userId,  
            userData,        
            { new: true }     
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }
    catch(error){
        console.error(error)
        res.status(500).json({ message: "Error updating user data" });
    }
})

module.exports = router
