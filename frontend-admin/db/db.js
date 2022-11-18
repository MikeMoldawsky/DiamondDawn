const mongoose = require("mongoose");

function getDbConnection() {
  console.log("Creating mongo connection with", { mongo: process.env.MONGO });
  return mongoose.createConnection(process.env.MONGO);
}

const conn = getDbConnection();

// Bind connection to error event (to get notification of connection errors)
conn.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = conn;
