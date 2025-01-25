const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    price_per_kg: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    }, 
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoryDBG'
    },
    imageUrl: {
        type: String,
    },
    farmer_location: {
        type: String,
    },
    farm_produce_store_date: {
        type: Date,
        require: true
    },
    produce_quantity: {
        type: Number,
        require: true
    }
})

module.exports = mongoose.model('ProductDBG', productSchema)