const express = require('express')
const AddressDBG = require('../models/address.model')
const protectedRoute = require('../middleware/protectedRoute')
const router = express.Router()

router.use(protectedRoute)

router.get('/address', async(req, res) => {
    try{
        const allAddresses = await AddressDBG.find()
        res.status(200).json(allAddresses)
    }
    catch(error) {
        res.status(500).json({ message: "Error fetching all addresses" })
    }
})

router.get('/address/:userId', async(req, res) => {
    const { userId } = req.params;
    try{
        const address = await AddressDBG.find({ userId })
        if(!address){
            res.status(404).json({message: "address not found!"} )
        }
        res.status(200).json(address)
    }
    catch(error) {
        res.status(500).json({message: "Error fetching user address"})
    }
})

// GET a specific address for a user 
router.get('/address/:userId/primary', async (req, res) => {
    const { userId } = req.params;
    try{
        const address = await AddressDBG.findOne({ userId, isPrimary: true });
        if(!address){
            return res.status(404).json({ message: "Primary address not found!"})
        }
        res.status(200).json(address)
    }
    catch(error){
        res.status(500).json({ message: "Error getting primary address", error })
    }
})


// POST an Address
router.post('/address/:userId', async(req,res) => {
    try{
        const { userId } = req.params;
        const {  name, city, state, apartment, street, phoneNo, zipcode, isPrimary } = req.body;
        
        const newAddress = new AddressDBG({
            userId,
            name, 
            city, 
            state, 
            apartment, 
            street, 
            phoneNo, 
            zipcode,
            isPrimary
        })

        await newAddress.save()
        res.status(201).json(newAddress)
    }
    catch(error){
        res.status(500).json({message: "Error posting address"})
    }
})

// UPDATE an Address
router.put('/address/:id', async(req, res) => {
   
    const { id } = req.params;
    const addressData = req.body;
    
    try{
      const address = await AddressDBG.findByIdAndUpdate(id, addressData, { new: true })
      
      if(!address){
        return res.status(404).json({ message: "Address not found" })
      }
     
      const updatedAddress = await address.save();
      res.status(200).json(updatedAddress);
    } 
    catch(error) {
        res.status(500).json({message: "Error updating the address"})
    }
})

// DELETE an Address
router.delete('/address/:id', async(req, res) => {
    const addressID = req.params.id 
    try{
        const deletedAddress = await AddressDBG.findByIdAndDelete(addressID)
        if(!deletedAddress) {
            res.status(404).json({error: "address not found"})
        }
        res.status(200).json({message: "address deleted successfully", deletedAddress})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: "Error deleting the address"})
    }
})

module.exports = router
