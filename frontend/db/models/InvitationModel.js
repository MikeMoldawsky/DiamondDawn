const mongoose = require("mongoose");
const db = require("../db");
require("./CollectorModel");
const ObjectId = mongoose.Schema.Types.ObjectId;

const InvitationSchema = new mongoose.Schema({
  createdAt: { type: Date, required: true, default: Date.now },
  createdBy: { type: ObjectId, ref: "Collector" },
  usedBy: { type: ObjectId, ref: "Collector" },
  revoked: { type: Boolean },
  note: { type: String },
});

const InvitationModel = db.model("Invitation", InvitationSchema);

module.exports = InvitationModel;
