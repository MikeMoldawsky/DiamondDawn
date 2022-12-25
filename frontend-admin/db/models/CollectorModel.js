const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
require("./InvitationModel"); // required because of ref

const COLLECTOR_STATUS = [
  "Applied",
  "InReview",
  "Rejected",
  "Maybe",
  "Good",
  "ToApprove",
  "Approved",
];

const CollectorSchema = new mongoose.Schema({
  createdAt: { type: Date, required: true, default: Date.now },
  address: { type: String, unique: true, required: true },
  twitter: { type: String },
  email: { type: String, unique: true },
  location: { type: String },
  note: { type: String },
  invitedBy: { type: ObjectId, ref: "Invitation" },
  status: { type: String, enum: COLLECTOR_STATUS, default: "Applied" },
  statusInfo: { type: String },
  buyProbability: { type: Number, min: 1, max: 5 },
  approved: { type: Boolean, required: true, default: false },
  mintWindowStart: { type: Date },
  minted: { type: Boolean, default: false },
  isDao: { type: Boolean, default: false },
  invitations: { type: [{ type: ObjectId, ref: "Invitation" }], default: [] },
});

const CollectorModel = mongoose.model("Collector", CollectorSchema);

module.exports = CollectorModel;
