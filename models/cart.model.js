const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDBG',
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ProductDBG',
                required: true,
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
})

module.exports = mongoose.model('CartDBG', cartSchema)