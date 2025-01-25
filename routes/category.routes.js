const express = require('express')
const CategoryDBG = require('../models/category.model')
const router = express.Router()

router.get('/categories', async (req, res) => {
    try{
        const categories = await CategoryDBG.find()
        res.json(categories)
    }
    catch(error){
        res.status(500).json({ message: 'Error fetching Categories.', error})
    }
})

router.get('/categories/:id', async (req, res) => {
    const { id } = req.params;
    try{
        const category = await CategoryDBG.findById(id)
        if(!category){
            res.status(404).json({ message: "Category not found!"})
        }
        res.status(200).json(category)
    }
    catch(error){
        res.status(500).json({ message: 'Error fetching Category.', error})
    }
})

router.post('/categories', async (req, res) => {
    const { name, imageUrl } = req.body
    try{
        const newCategory = new CategoryDBG({ name, imageUrl });
        await newCategory.save()
        res.status(201).json(newCategory)
    }
    catch(error){
        res.status(500).json({ message: "Error creating the Category" })
    }
})

router.put('/categories/:id', async(req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try{
        const categoryToUpdate = await CategoryDBG.findByIdAndUpdate(id, updatedData, { new: true } )
        if(!categoryToUpdate){
            res.status(404).json({ message: "Category not found!"});
        }
        res.status(201).json(categoryToUpdate)
    }
    catch(error){
        res.status(500).json({ message: "Error updating the Category" })
    }
})

router.delete('/categories/:id', async(req, res) => {
    const { id } = req.params;
    try{
        const deletedCategory = await CategoryDBG.findByIdAndDelete(id)
        if(!deletedCategory){
            res.status(404).json({ message: "Category not found!"})
        }
        res.status(200).json({ message: "Category deleted successfully.", category: deletedCategory})
    }
    catch(error){
        res.status(500).json({ message: "Error deleting the Category" })
    }
})

module.exports = router;