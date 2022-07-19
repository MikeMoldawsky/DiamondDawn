const mongoose = require("mongoose");

function getDbConnection() {
  console.log("MIKE PARAMSSSS", {
    vercelenv: process.env.VERCEL_ENV,
    ref: process.env.VERCEL_GIT_COMMIT_REF,
    author: process.env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN,
  });
  if (
    process.env.VERCEL_ENV === "preview" &&
    process.env.VERCEL_GIT_COMMIT_REF !== "develop"
  ) {
    switch (process.env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN) {
      case "mike":
        return mongoose.createConnection(process.env.MONGODB_URI);
      case "asaf":
        return mongoose.createConnection(process.env.MONGODB_URI);
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
