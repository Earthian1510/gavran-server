const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: 'user',
    },
    userImage: {
        type: String,
        default: "http://www.listercarterhomes.com/wp-content/uploads/2013/11/dummy-image-square.jpg",
    }
    // Address 

}, 
{
    timestamps: true
})

module.exports = mongoose.model('UserDBG', userSchema);