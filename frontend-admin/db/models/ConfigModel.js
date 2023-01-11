const mongoose = require("mongoose");

const ConfigSchema = new mongoose.Schema({
  stageTime: { type: Date },
  eruptionTxs: { type: [String], default: [] },
  mintOpen: { type: Boolean, default: false },
});

const ConfigModel = mongoose.model("Config", ConfigSchema);

module.exports = ConfigModel;
