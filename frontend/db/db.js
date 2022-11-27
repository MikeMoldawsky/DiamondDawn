const mongoose = require("mongoose");

const uri = process.env.MONGO;
const options = {};
let connection = null;
// const options = {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
// };

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
    connection = await mongoose.connect(uri, options);
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
