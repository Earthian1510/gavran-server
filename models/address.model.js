const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDBG',  
        required: true,
    },
    name: {
        type: String,
        required: true 
    },
    apartment: {
        type: String,
        required: true 
    }, 
    street: {
        type: String,
        required: true 
    }, 
    city: {
        type: String,
        required: true 
    }, 
    state: {
        type: String,
        required: true 
    }, 
    phoneNo: {
        type: String,
        required: true
    },
    zipcode: {
        type: Number,
        required: true
    },
    isPrimary: {
        type: Boolean,
        default: false,
    }

})

module.exports = mongoose.model('AddressDBG', addressSchema)