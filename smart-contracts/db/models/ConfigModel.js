const mongoose = require("mongoose");
const db = require("../db");

const ConfigSchema = new mongoose.Schema({
  stageTime: { type: Date },
  eruptionTxs: { type: [String], default: [] },
});

const ConfigModel = db.model("Config", ConfigSchema);

module.exports = ConfigModel;
