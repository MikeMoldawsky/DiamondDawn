const mongoose = require("mongoose");

const ConfigSchema = new mongoose.Schema({
  stageTime: { type: Date },
  mintOpen: { type: Boolean, default: false },
  mintOpenTime: { type: Date },
  offset: { type: Number, default: 0 },
});

const ConfigModel = mongoose.model("Config", ConfigSchema);

module.exports = ConfigModel;
