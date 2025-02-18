const express = require('express')
const OrderDBG = require('../models/order.model')
const protectedRoute = require('../middleware/protectedRoute')
const router = express.Router()

router.use(protectedRoute)

router.get('/orders', async(req, res) => {
    try{
        const allOrders = await OrderDBG.find()
        res.status(200).json(allOrders)
    }
    catch(error) {
        res.status(500).json({ message: "Error fetching all orders" })
    }
})

router.get('/orders/:userId', async(req, res) => {
    const { userId } = req.params;
    try{
        const orders = await OrderDBG.find({ userId })
        if(!orders){
            res.status(404).json({message: "orders not found!"} )
        }
        res.status(200).json(orders)
    }
    catch(error) {
        res.status(500).json({message: "Error fetching user orders"})
    }
})

// GET a specific order for a user 
router.get('/orders/:userId/:orderId', async (req, res) => {
    const { userId, orderId } = req.params;
    try{
        const order = await OrderDBG.findOne({ userId, _id: orderId });
        if(!order){
            return res.status(404).json({ message: "order not found!"})
        }
        res.status(200).json(order)
    }
    catch(error){
        res.status(500).json({ message: "Error getting user order", error })
    }
})


// POST an Order
router.post('/orders/:userId', async(req,res) => {
    try{
        const { userId } = req.params;
        const { orderInfo, shippingorder } = req.body;
        
        const newOrder = new OrderDBG({ userId, orderInfo, shippingorder })

        await newOrder.save()
        res.status(201).json(newOrder)
    }
    catch(error){
        res.status(500).json({message: "Error posting order"})
    }
})

// UPDATE an Order
router.put('/orders/:id', async(req, res) => {
   
    const { id } = req.params;
    const orderDetails = req.body;
    
    try{
      const order = await OrderDBG.findByIdAndUpdate(id, orderDetails, { new: true })
      
      if(!order){
        return res.status(404).json({ message: "order not found" })
      }
     
      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } 
    catch(error) {
        res.status(500).json({message: "Error updating the order"})
    }
})

// DELETE an order
router.delete('/orders/:id', async(req, res) => {
    const { id } = req.params
    try{
        const deletedOrder = await OrderDBG.findByIdAndDelete(id)
        if(!deletedOrder) {
            res.status(404).json({error: "order not found"})
        }
        res.status(200).json({message: "order deleted successfully", deletedOrder})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({message: "Error deleting the order"})
    }
})

module.exports = router