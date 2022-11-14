// const InviteModel = require("./models/InviteModel");
const Invitation = require("./models/InvitationModel");
const add = require("date-fns/add");
const ethers = require("ethers");
const signer = require("../helpers/signer");
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

async function getInviteObjectById(inviteId) {
  return Invitation.findById(inviteId).populate("createdBy");
  // return Invitation.findById(inviteId).populate("createdBy");



  // const invite = (await InviteModel.findById(inviteId)).toObject();
  // if (!invite) return invite;
  //
  // if (invite.opened && process.env.REACT_APP_INVITE_TTL_SECONDS > 0) {
  //   invite.expires = add(invite.opened, {
  //     seconds: process.env.REACT_APP_INVITE_TTL_SECONDS,
  //   });
  //
  //   if (invite.used || invite.expires < new Date()) {
  //     invite.revoked = true;
  //   }
  // }
  //
  // return invite;
}

function validateAddress(address) {
  if (!ethers.utils.isAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }
}

function validateInviteBeforeAction(invite, address) {
  if (!invite || invite.used || invite.revoked || !invite.approved) {
    throw new Error("Invalid invitation");
  }
  if (address !== invite.address) {
    throw new Error(`Wrong Ethereum address`);
  }
  if (invite.used) {
    throw new Error("Invitation already used");
  }
  if (invite.revoked) {
    throw new Error("Invitation revoked");
  }
  if (!invite.approved) {
    throw new Error("Invitation pending approval");
  }
}

async function useInvite(inviteId, collectorId) {
  // validateAddress(address);
  const invite = await getInviteObjectById(inviteId);
  // validateInviteBeforeAction(invite, address);

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

async function getInviteByAddress(address) {
  const invite = await Invitation.findOne({ address });
  return invite ? getInviteObjectById(invite) : null;
}

module.exports = {
  getInviteObjectById,
  useInvite,

  openInvite,
  signInvite,
  confirmInviteUsed,
  createInviteRequest,
  getInviteByAddress,
};
