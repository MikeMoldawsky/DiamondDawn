const mongoose = require("mongoose");
const db = require("../db");

const COLOR_GRADES = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const CLARITY_GRADES = ['FLAWLESS', 'INTERNALLY FLAWLESS', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3']
const COMMON_GRADES = ['EXCELLENT', 'VERY GOOD', 'GOOD', 'FAIR', 'POOR']

const DiamondSchema = new mongoose.Schema({
  GIAReportId: { type: Number, required: true },
  GIAReportDate: { type: Number, required: true },
  shape: { type: Number, required: true, min: 0, max: 2 },
  measurements: { type: String, required: true },
  caratWeight: { type: mongoose.Types.Decimal128, required: true },
  colorGrade: { type: String, enum: COLOR_GRADES, required: true },
  clarityGrade: { type: String, enum: CLARITY_GRADES, required: true },
  cutGrade: { type: String, enum: COMMON_GRADES, required: true },
  polish: { type: String, enum: COMMON_GRADES, required: true },
  symmetry: { type: String, enum: COMMON_GRADES, required: true },
  fluorescence: { type: String, enum: COMMON_GRADES, required: true },
});

const DiamondModel = db.model("Diamond", DiamondSchema);

module.exports = DiamondModel;
