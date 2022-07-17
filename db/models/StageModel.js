const mongoose = require("mongoose");
const db = require("../db");

const StageSchema = new mongoose.Schema({
  stage: { type: Number, required: true },
  startsAt: { type: Date },
});

const StageModel = db.model("Stage", StageSchema);

module.exports = StageModel;
