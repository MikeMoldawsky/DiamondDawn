const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
require("./CollectorModel"); // required because of ref

const InvitationSchema = new mongoose.Schema({
  createdAt: { type: Date, required: true, default: Date.now },
  createdBy: { type: ObjectId, ref: "Collector" },
  usedBy: { type: ObjectId, ref: "Collector" },
  revoked: { type: Boolean },
  note: { type: String },
  inviter: { type: String },
});

const InvitationModel = mongoose.model("Invitation", InvitationSchema);

module.exports = InvitationModel;
