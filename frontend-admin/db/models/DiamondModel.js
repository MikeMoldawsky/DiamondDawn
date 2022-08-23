const mongoose = require("mongoose");
const db = require("../db");

const SHAPES = ["Pear", "Round", "Oval", "Radiant"];

const COLOR_GRADES = [
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const CLARITY_GRADES = ["VS2", "VS1", "VVS2", "VVS1", "IF", "FL"];

const FLUORESCENCE_GRADES = ["Faint", "None"];

const COMMON_GRADES = ["Good", "Very Good", "Excellent"];

const MIN_POINTS = 30;
const MAX_POINTS = 70;

const DiamondSchema = new mongoose.Schema({
  reportNumber: { type: Number, required: true },
  reportDate: { type: Number, required: true },
  shape: { type: Number, required: true, min: 1, max: SHAPES.length },
  points: { type: Number, required: true, min: MIN_POINTS, max: MAX_POINTS },
  color: { type: Number, required: true, min: 1, max: COLOR_GRADES.length },
  clarity: { type: Number, required: true, min: 1, max: CLARITY_GRADES.length },
  cut: { type: Number, required: true, min: 1, max: COMMON_GRADES.length },
  polish: { type: Number, required: true, min: 1, max: COMMON_GRADES.length },
  symmetry: { type: Number, required: true, min: 1, max: COMMON_GRADES.length },
  fluorescence: {
    type: Number,
    required: true,
    min: 1,
    max: FLUORESCENCE_GRADES.length,
  },
  measurements: {
    type: String,
    required: true,
    match: [
      /\d\.\d\d - \d\.\d\d x \d\.\d\d/,
      "Please fill a valid email address",
    ],
  },
});

const DiamondModel = db.model("Diamond", DiamondSchema);

module.exports = DiamondModel;
