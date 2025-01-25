const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String
    }
})

module.exports = mongoose.model('CategoryDBG', categorySchema)
