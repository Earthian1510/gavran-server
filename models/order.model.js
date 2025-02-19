const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDBG',
        required: true,
    },
    orderInfo: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ProductDBG',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            }
        }
    ],
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AddressDBG',
        required: true
    },
})

module.exports = mongoose.model('OrderDBG', orderSchema)