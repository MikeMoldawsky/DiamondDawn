const mongoose = require("mongoose");
const { getDiamondDawnContract } = require("../db/contract-db-manager");

const uri = process.env.MONGO;
const options = {
  autoIndex: false,
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
};
let connection = null;

if (!uri) {
  throw new Error("Please add your Mongo URI as and env var");
}

async function connectToDatabase() {
  try {
    if (connection) {
      console.log("Using cached MongoDB client...");
      return connection;
    }
    console.log("Connecting to MongoDB...");
    const start = Date.now();
    connection = await mongoose.connect(uri, options);
    const end = Date.now();
    console.log(`ConnectToDatabase Execution time: ${end - start} ms`);
    return connection;
  } catch (e) {
    console.log("MongoDB connection error:", e);
  }
}

connectToDatabase()
  .then((_) => console.log("Successfully connected to MongoDB"))
  .catch((error) => console.log("Connection error:", error));

module.exports = {
  connectToDatabase,
};
