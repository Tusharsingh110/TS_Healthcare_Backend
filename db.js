const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

const connectToMongo = async () => {
    try {
        // console.log(process.env.MONGODB_URI); // Add this line
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB successfully!!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

module.exports = connectToMongo;
