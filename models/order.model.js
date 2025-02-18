const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDB',
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
        ref: 'AddressDB',
        required: true
    },
})

module.exports = mongoose.model('OrderDBG', orderSchema)