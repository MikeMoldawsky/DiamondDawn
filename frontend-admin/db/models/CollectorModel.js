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
  honorary: { type: Boolean },
  trusted: { type: Boolean },
  numNFTs: { type: Number, min: 1, max: 5, default: 1 },
  note: { type: String },
  invitedBy: { type: ObjectId, ref: "Invitation" },
  status: { type: String, enum: COLLECTOR_STATUS, default: "Applied" },
  statusInfo: { type: String },
  approved: { type: Boolean, required: true, default: false },
  isDao: { type: Boolean, default: false },
  invitations: { type: [{ type: ObjectId, ref: "Invitation" }], default: [] },
});

const CollectorModel = mongoose.model("Collector", CollectorSchema);

module.exports = CollectorModel;
