const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
require("./CollectorModel"); // required because of ref

const InvitationSchema = new mongoose.Schema({
  createdAt: { type: Date, required: true, default: Date.now },
  inviter: { type: ObjectId, ref: "Collector" },
  inviterName: { type: String },
  honoraryInvitee: { type: Boolean },
  trustedInvitee: { type: Boolean },
  numNFTs: { type: Number, min: 1, max: 5 },
  note: { type: String },
  sent: { type: Boolean },
  viewed: { type: Boolean },
  collector: { type: ObjectId, ref: "Collector" },
  revoked: { type: Boolean },
});

const InvitationModel = mongoose.model("Invitation", InvitationSchema);

module.exports = InvitationModel;
