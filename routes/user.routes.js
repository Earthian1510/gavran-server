const express = require('express')
const UserDBG = require('../models/user.model')
const protectedRoute = require('../middleware/protectedRoute')
const router = express.Router()
const multer = require('multer')
const { v2: cloudinary } = require('cloudinary')
const { CloudinaryStorage} = require('multer-storage-cloudinary')
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'user-images',
        format: async (req, file) => 'png',
        public_id: (req, file) => Date.now() + '-' + Math.round(Math.random() * 1e9)
    }
})

const upload = multer({ storage })

router.use(protectedRoute)

router.post('/user/upload-image', upload.single('image'), async(req, res) => {
    try{
        if(!req.file){
            return res.status(400).json({ message: "No file uploaded."})
        }

        res.status(200).json({ imageUrl: req.file.path });
    }
    catch(error){
        console.error(error)
        res.status(500).json({ message: 'Error uploading image.'})
    }
})

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
