// const InviteModel = require("./models/InviteModel");
const Invitation = require("./models/InvitationModel");
const add = require("date-fns/add");
const ethers = require("ethers");
const signer = require("../helpers/signer");
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

async function getInviteObjectById(inviteId) {
  return Invitation.findById(inviteId).populate("createdBy");
}

function validateAddress(address) {
  if (!ethers.utils.isAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }
}

function validateInviteBeforeAction(invite) {
  if (!invite) {
    throw new Error("Invitation not found");
  }
  if (invite.usedBy) {
    throw new Error("Invitation already used");
  }
  if (invite.revoked) {
    throw new Error("Invitation revoked");
  }
}

async function useInvite(inviteId, collectorId) {
  const invite = await getInviteObjectById(inviteId);
  validateInviteBeforeAction(invite);

  await Invitation.findOneAndUpdate({ _id: inviteId }, { usedBy: collectorId });

  return await getInviteObjectById(inviteId);
}

async function openInvite(inviteId, address, country, state) {
  validateAddress(address);
  const invite = await getInviteObjectById(inviteId);
  validateInviteBeforeAction(invite, address);

  await Invitation.findOneAndUpdate(
    { _id: inviteId },
    {
      opened: invite.opened || Date.now(),
      location: `${state}, ${country}`,
    }
  );

  return await getInviteObjectById(inviteId);
}

async function signInvite(inviteId, address) {
  validateAddress(address);
  const invite = await getInviteObjectById(inviteId);
  validateInviteBeforeAction(invite, address);

  const signature = await signer.signAddress(address);

  return { invite, signature };
}

async function confirmInviteUsed(inviteId, address) {
  validateAddress(address);
  const invite = await getInviteObjectById(inviteId);
  validateInviteBeforeAction(invite, address);

  await Invitation.findOneAndUpdate({ _id: inviteId }, { used: true });

  return await getInviteObjectById(inviteId);
}

async function createInviteRequest(
  address,
  twitter,
  email,
  note,
  country,
  state
) {
  validateAddress(address);
  let invite = await Invitation.findOne({ address });
  if (invite) {
    throw new Error("Address already invited");
  }
  invite = new Invitation({
    address,
    twitter,
    email,
    note,
    location: `${state}, ${country}`,
  });
  return invite.save();
}

module.exports = {
  getInviteObjectById,
  useInvite,

  openInvite,
  signInvite,
  confirmInviteUsed,
  createInviteRequest,
};
