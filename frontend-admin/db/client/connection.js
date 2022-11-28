const mongoose = require("mongoose");

const uri = process.env.MONGO;
const options = {
  autoIndex: false,
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
};

if (!uri) {
  throw new Error("Please add your Mongo URI as and env var");
}

const start = Date.now();
console.log("Connecting to MongoDB...", start);
const clientDBPromise = mongoose.connect(uri, options)
    .then((_) => console.log(`Successfully connected to MongoDB. Execution time: ${Date.now() - start} ms`))
    .catch((error) => console.log("MongoDB connection error", error));

export default clientDBPromise;
