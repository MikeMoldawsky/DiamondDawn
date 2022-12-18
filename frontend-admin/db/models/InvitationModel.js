const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
require("./CollectorModel"); // required because of ref

const InvitationSchema = new mongoose.Schema({
  createdAt: { type: Date, required: true, default: Date.now },
  createdBy: { type: ObjectId, ref: "Collector" },
  inviter: { type: String },
  note: { type: String },
  sent: { type: Boolean },
  viewed: { type: Boolean },
  usedBy: { type: ObjectId, ref: "Collector" },
  revoked: { type: Boolean },
});

const InvitationModel = mongoose.model("Invitation", InvitationSchema);

module.exports = InvitationModel;
