const mongoose = require("mongoose");

function getDbConnection() {
  console.log("Connecting to MongoDB...");
  
  if (
    process.env.VERCEL_ENV === "preview" &&
    process.env.VERCEL_GIT_COMMIT_REF !== "develop"
  ) {
    switch (process.env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN) {
      case "MikeMoldawsky":
        return mongoose.createConnection(process.env.MONGODB_URI_MIKE);
      case "sniirr":
        return mongoose.createConnection(process.env.MONGODB_URI_ASAF);
      case "galkleinman":
        throw mongoose.createConnection(process.env.MONGODB_URI_GAL);
      case "smarth30":
        throw Error("Samarth send to Mike a mongo url for development");
      default:
        throw Error(
          "MongoDB url is required for preview mode that is not on develop"
        );
    }
  }
  return mongoose.createConnection(process.env.MONGODB_URI);
}

const conn = getDbConnection();

// Bind connection to error event (to get notification of connection errors)
conn.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = conn;
