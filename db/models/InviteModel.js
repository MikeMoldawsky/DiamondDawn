const Chance = require("chance");
const mongoose = require("mongoose");
const db = require("../db");

const chance = new Chance();

const InviteSchema = new mongoose.Schema({
  twitter: { type: String },
  password: {
    type: Number,
    required: true,
    default: () => chance.integer({ min: 100000, max: 999999 }),
  },
  created: { type: Date, required: true, default: Date.now },
  revoked: { type: Boolean, required: true, default: false },
  opened: { type: Date },
  note: { type: String },
});

const InviteModel = db.model("Invite", InviteSchema);

module.exports = InviteModel;
