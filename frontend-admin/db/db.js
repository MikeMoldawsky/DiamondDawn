const mongoose = require("mongoose");

function getDbConnection() {
  return mongoose.createConnection(process.env.MONGODB_URI);
}

const conn = getDbConnection();

// Bind connection to error event (to get notification of connection errors)
conn.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = conn;
