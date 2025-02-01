const express = require('express')
const CartDBG = require('../models/cart.model')
const protectedRoute = require('../middleware/protectedRoute')
const router = express.Router()

router.use(protectedRoute)

router.get('/cart/:userId', async (req, res ) => {
    const { userId } = req.params;
    try{
        const cart = await CartDBG.findOne({ userId }).populate('items.productId')
        if(!cart){
            return res.status(404).json({ message: 'Cart not found'})
        }
        res.status(200).json(cart)
    }
    catch(error){
        console.error(error)
        res.status(500).json({ message: "Error fetching user cart"})
    }
})

router.post('/cart/:userId/items', async(req, res) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;
    try{
        let cart = await CartDBG.findOne({ userId })
        if(!cart){
            cart = new CartDBG({
                userId, 
                items: []
            })
        }
        const existingItem = cart.items.find((item) => item.productId === productId)
        if(existingItem){
            existingItem.quantity += quantity
        }
        else{
            cart.items.push({ productId, quantity})
        }

        const updatedCart = await cart.save()
        res.status(200).json({ message: "Product added to cart ! ", updatedCart})
    }
    catch(error){
        console.error(error)
        res.status(500).json({ message: "Error adding product to user cart"})
    }
})

router.patch('/cart/:userId/items/:productId/increase', async (req, res) => {
    const { userId, productId} = req.params;
    try{
        const cart = await CartDBG.findOne({ userId })
        if(!cart){
            return res.status(404).json({ message: "Cart not found"})
        }

        const item = cart.items.find((item) => item.productId.toString() === productId)
        if(!item){
            return res.status(404).json({ message: "Item not found in cart"})
        }

        item.quantity += 1;
        const updatedCart = await cart.save()
        res.status(200).json(updatedCart)

    }
    catch(error){
        console.error(error)
        res.status(500).json({ message: "Error increasing quantity"})
    }
})

router.patch('/cart/:userId/items/:productId/decrease', async (req, res) => {
    const { userId, productId} = req.params;
    try{
        const cart = await CartDBG.findOne({ userId })
        if(!cart){
            return res.status(404).json({ message: "Cart not found"})
        }

        const item = cart.items.find((item) => item.productId.toString() === productId)
        if(!item){
            return res.status(404).json({ message: "Item not found in cart"})
        }

        item.quantity -= 1;
        if(item.quantity <= 0){
            cart.items = cart.items.filter((item) => item.productId.toString() !== productId)
        }
        const updatedCart = await cart.save()
        res.status(200).json(updatedCart)

    }
    catch(error){
        console.error(error)
        res.status(500).json({ message: "Error decreasing quantity"})
    }
})

router.delete('/cart/:userId', async (req, res) => {
    const { userId } = req.params;
    try{
        const cart = await CartDBG.findOne({ userId })
        if(!cart){
            return res.status(404).json({ message: "Cart not found"})
        }

        cart.items = []
        const updatedCart = await cart.save()
        res.status(200).json({message: "Cart emptied successfully", updatedCart})
    }
    catch(error){
        console.error(error)
        res.status(500).json({ message: "Error deleting cart"})
    }
})

router.delete('/cart/:userId/items/:productId', async (req, res) => {
    const { userId, productId } = req.params
    try{
        const cart = await CartDBG.findOne({ userId })
        if(!cart){
            return res.status(404).json({ message: "Cart not found"})
        }

        const updatedItems = cart.items.filter((item) => item.productId.toString() !== productId)
        if(updatedItems.length === cart.items.length){
            return res.status(404).json({ message: "Product not found in cart"})
        }

        cart.items = updatedItems
        const updatedCart = await cart.save()
        res.status(200).json({ message: "product removed from cart", updatedCart})
    }
    catch(error){
        console.error(error)
        res.status(500).json({ message: "Error removing cart item"})
    }
})

router.get('/cart', async (req, res) => {
    try{
      const carts = await CartDBG.find().populate('items.productId');
      res.status(200).json(carts)
    }
    catch(error){
      console.error(error)
      return res.status(500).json({ message: 'Internal Server Error'});
    }
})

module.exports = router