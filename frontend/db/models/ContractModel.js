const mongoose = require("mongoose");

const ContractSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  address: { type: String, required: true },
  artifact: { type: Object, required: true },
});

const ContractModel = mongoose.model("Contract", ContractSchema);

module.exports = ContractModel;
