const mongoose = require("mongoose");
const db = require("../db");

const ContractSchema = new mongoose.Schema({
  name: { type: String, unique : true, required: true },
  address: { type: String, required: true },
  artifact: { type: Object, required: true },
});

const ContractModel = db.model("Contract", ContractSchema);

module.exports = ContractModel;
