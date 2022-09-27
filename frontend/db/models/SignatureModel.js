const mongoose = require("mongoose");
const db = require("../db");

const SignatureSchema = new mongoose.Schema({
  address: { type: String },
  sig: { type: String },
});

const SignatureModel = db.model("Signature", SignatureSchema);

module.exports = SignatureModel;
