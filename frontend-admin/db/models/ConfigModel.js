const mongoose = require("mongoose");
const db = require("../db");

const ConfigSchema = new mongoose.Schema({
  stageTime: { type: Date },
});

const ConfigModel = db.model("Config", ConfigSchema);

module.exports = ConfigModel;
