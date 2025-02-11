const mongoose = require("mongoose");
require("dotenv").config();
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to Database");
  } catch (error) {
    console.error("Error connecting to Database:", error.message);
    process.exit(1);
  }
};
module.exports = connectDb;