const express = require('express')
const ProductDBG = require('../models/product.model')
const router = express.Router()

router.get('/products', async(req, res) => {
    try{
        const products = await ProductDBG.find().populate('category');
        res.status(200).json(products);
    }
    catch(error){
        res.status(500).json({ message: "Error fetching products", error})
    }
})

router.get('/products/:id', async (req , res) => {
    const { id } = req.params;
    try{
        const product = await ProductDBG.findById(id).populate('category');
        if(!product){
            return res.status(404).json({ message: "Product not found."})
        }
        res.status(200).json(product)
    }
    catch(error){
        res.status(500).json({ message: "Error fetching product", error})
    }
})

router.post('/products', async(req, res) => {
    const productData = req.body;
    try{
        const newProduct = new ProductDBG(productData);
        await newProduct.save();
        res.status(201).json(newProduct);
    }
    catch(error){
        res.status(500).json({ message: "Error creating product", error})
    }
})

router.put('/products/:id', async(req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try{
        const updatedProduct = await ProductDBG.findByIdAndUpdate(id, updatedData, {new: true});
        if(!updatedProduct){
            return res.status(404).json({ message: "Product not found."})
        }
        res.status(200).json(updatedProduct)        
    }
    catch(error){
        res.status(500).json({ message: "Error updating product", error})
    }
})

router.delete('/products/:id', async(req, res) => {
    const { id } = req.params;
    try{
        const deletedProduct = await ProductDBG.findByIdAndDelete(id)
        if(!deletedProduct){
            return res.status(404).json({ message: "Product not found!"})
        }
        res.status(200).json({ message: "Product deleted successfully", product: deletedProduct})
    }
    catch(error){
        res.status(500).json({ message: "Error deleting product", error})
    }
})

module.exports = router;