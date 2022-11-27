const mongoose = require("mongoose");

const ConfigSchema = new mongoose.Schema({
  stageTime: { type: Date },
});

const ConfigModel = mongoose.model("Config", ConfigSchema);

module.exports = ConfigModel;
