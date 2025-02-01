const express = require('express')
const WishlistDBG = require('../models/wishlist.model')
const router = express.Router()
const protectedRoute = require('../middleware/protectedRoute')

router.use(protectedRoute)

router.get('/wishlist/:userId', async (req, res) => {
    const { userId } = req.params;
    try{
        const wishlist = await WishlistDBG.findOne({ userId }).populate('products.productId')
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }
        res.status(200).json(wishlist);
    }
    catch(error){
        console.error(error)
        res.status(500).json({ message: "Error fetching wishlist"})
    }
})

router.post('/wishlist/:userId/products', async (req, res) => {
    const { userId } = req.params;
    const { productId } = req.body;

    if(!productId){
        return res.status(400).json({ message: "Product Id is required"})
    }

    try{
        let wishlist = await WishlistDBG.findOne({ userId })
        if(!wishlist){
            wishlist = new WishlistDBG({
                userId, 
                products: [],
            })
        }

        const existingProduct = wishlist.products.find((item) => item.productId.toString() === productId)
        if(existingProduct){
            return res.status(400).json({ message: "product already exists in wishlist"})
        }

        wishlist.products.push({ productId })
        const updatedWishlist = await wishlist.save()
        res.status(200).json({ message: "Product added successfully", updatedWishlist})
    }
    catch(error){
        console.error(error)
        res.status(500).json({ message: "Error adding product to wishlist"})
    }
})

router.delete('/wishlist/:userId', async(req, res) => {
    const { userId } = req.params
    try{
        const wishlist = await WishlistDBG.findOne({ userId });

        if (!wishlist) {
          return res.status(404).json({ message: 'Wishlist not found' });
        }
    
        wishlist.products = [];
        const updatedWishlist = await wishlist.save();
    
        res.status(200).json({ message: 'Wishlist emptied successfully', updatedWishlist})
    }
    catch(error){
        console.error(error)
        res.status(500).json({ message: "Error empting wishlist"})
    }
})

router.delete('/wishlist/:userId/products/:productId', async(req, res) => {
    const { userId, productId } = req.params
    try{
        const wishlist = await WishlistDBG.findOne({ userId })
        if(!wishlist){
            return res.status(404).json({ message: "wishlist not found"})
        }
        const updatedProducts = wishlist.products.filter((item) => item.productId.toString() !== productId)
        if(updatedProducts.length === wishlist.products.length){
            return res.status(404).json({ message: "Product not found in wishlist"})
        }
        wishlist.products = updatedProducts
        const updatedWishlist = await wishlist.save()
        res.status(200).json({ message: "Product removed from wishlist", updatedWishlist})
    }
    catch(error){
        console.error(error)
        res.status(500).json({ message: "Error removing wishlist product"})
    }
})

router.get('/wishlist', async (req, res) => {
    try{
        const wishlist = await WishlistDBG.find()
        res.status(200).json(wishlist);
    }
    catch(error){
        console.error(error)
        res.status(500).json({ message: "Error fetching wishlist"})
    }
})

module.exports = router