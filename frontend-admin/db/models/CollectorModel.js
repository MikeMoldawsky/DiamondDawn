const mongoose = require("mongoose");
const db = require("../db");
const ObjectId = mongoose.Schema.Types.ObjectId

const CollectorSchema = new mongoose.Schema({
  createdAt: { type: Date, required: true, default: Date.now },
  address: { type: String, unique: true, required: true },
  twitter: { type: String, unique: true },
  email: { type: String },
  location: { type: String },
  note: { type: String },
  invitedBy: { type: ObjectId, ref: "Invitation" },
  approved: { type: Boolean, required: true, default: false },
  mintWindowStart: { type: Date },
  minted: { type: Boolean, default: false },
  invitations: { type: [{ type: ObjectId, ref: "Invitation" }], default: [] },
});

const CollectorModel = db.model("Collector", CollectorSchema);

module.exports = CollectorModel;
