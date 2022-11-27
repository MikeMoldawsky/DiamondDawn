const mongoose = require("mongoose");

const InviteSchema = new mongoose.Schema({
  twitter: { type: String },
  email: { type: String },
  address: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now },
  approved: { type: Boolean, required: true, default: false },
  opened: { type: Date },
  used: { type: Boolean },
  location: { type: String },
  note: { type: String },
});

const InviteModel = mongoose.model("Invite", InviteSchema);

module.exports = InviteModel;
