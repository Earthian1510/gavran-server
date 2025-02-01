const mongoose = require('mongoose')
const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDBG',
        required: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ProductDBG',
                required: true,
            }
        }
    ]
})

module.exports = mongoose.model('WishlistDBG', wishlistSchema)