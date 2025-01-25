const mongoose = require('mongoose')
require('dotenv').config()

const mongoURI = process.env.MONGO_DB;

const initializeDB = async () => {
    try{
        const connection = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        if(connection){
            console.log("DB Connection Successful!");
            console.log("--------------------------\n");
        }

    }
    catch(error){
        console.log("DB Connection failed!");
    }
}

module.exports = initializeDB;