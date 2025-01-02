const mongoose = require("mongoose");
const colors = require("colors");
require('dotenv').config();

const connectDB = async () => {
  const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/your_database_name";
  console.log("MONGODB_URI:", MONGO_URI); // Debugging line

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;

