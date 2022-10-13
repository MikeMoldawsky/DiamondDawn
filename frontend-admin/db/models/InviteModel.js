const mongoose = require("mongoose");
const db = require("../db");

const InviteSchema = new mongoose.Schema({
  identifier: { type: String }, // twitter/email
  address: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now },
  approved: { type: Boolean, required: true, default: false },
  opened: { type: Date },
  used: { type: Boolean },
  location: { type: String },
  note: { type: String },
});

const InviteModel = db.model("Invite", InviteSchema);

module.exports = InviteModel;
