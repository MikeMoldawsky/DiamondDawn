const mongoose = require("mongoose");
const db = require("../db");

const InviteSchema = new mongoose.Schema({
  created: { type: Date, required: true, default: Date.now },
  opened: { type: Date },
  used: { type: Boolean },
  location: { type: String },
  twitter: { type: String },
  ethAddress: { type: String },
  note: { type: String },
});

const InviteModel = db.model("Invite", InviteSchema);

module.exports = InviteModel;
