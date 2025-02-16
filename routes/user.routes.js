const express = require('express')
const UserDBG = require('../models/user.model')
const protectedRoute = require('../middleware/protectedRoute')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

router.use(protectedRoute)

const uploadDirectory = path.join(__dirname, '../uploads');
if(!fs.existsSync(uploadDirectory)){
    fs.mkdirSync(uploadDirectory, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, fileName + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

router.post('/user/upload-image', protectedRoute, upload.single('image'), async(req, res) => {
    try{
        if(!req.file){
            return res.status(400).json({ message: "No file uploaded."})
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        res.status(200).json({ imageUrl });
    }
    catch(error){
        console.error(error)
        res.status(500).json({ message: 'Error uploading image.'})
    }
})

router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await UserDBG.findOne(userId)
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
