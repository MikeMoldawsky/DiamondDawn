const Chance = require("chance");
const mongoose = require("mongoose");
const db = require("../db");

const chance = new Chance();

const PasswordSchema = new mongoose.Schema({
  password: {
    type: Number,
    required: true,
    default: () => chance.integer({ min: 1000000000, max: 9999999999 }),
  },
  status: { type: String, of: ["available", "pending", "used"] },
});

const PasswordModel = db.model("Password", PasswordSchema);

module.exports = PasswordModel;
