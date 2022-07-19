const mongoose = require("mongoose");
const db = require("../db");

const DiamondSchema = new mongoose.Schema({
  GIA: { type: String, required: true },
  carat: { type: mongoose.Types.Decimal128, required: true },
  shape: { type: Number, required: true, min: 0, max: 2 },
});

const DiamondModel = db.model("Diamond", DiamondSchema);

module.exports = DiamondModel;
