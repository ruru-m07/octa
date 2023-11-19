const mongoose = require("mongoose");
require("dotenv").config();

// ** mongoBD URI 
const mongoURI = process.env.MONGODB_URI;

const connectToMongo = async () => {
  mongoose.set('strictQuery', false);
  mongoose.connect(mongoURI, () => {
    console.log("Connected to MongoDB ☘️ ");
  });
};

module.exports = connectToMongo;
