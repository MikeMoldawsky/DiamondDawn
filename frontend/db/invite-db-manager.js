const InviteModel = require("./models/InviteModel");
const add = require("date-fns/add");
const ethers = require("ethers");
const signer = require("../helpers/signer");

async function getInviteObjectById(inviteId) {
  const invite = (await InviteModel.findById(inviteId)).toObject();
  if (!invite) return invite;

  if (invite.opened && process.env.REACT_APP_INVITE_TTL_SECONDS > 0) {
    invite.expires = add(invite.opened, {
      seconds: process.env.REACT_APP_INVITE_TTL_SECONDS,
    });

    if (invite.used || invite.expires < new Date()) {
      invite.revoked = true;
    }
  }

  return invite;
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

async function openInvite(inviteId, address, country, state) {
  validateAddress(address);
  const invite = await getInviteObjectById(inviteId);
  validateInviteBeforeAction(invite, address);

  await InviteModel.findOneAndUpdate(
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

  await InviteModel.findOneAndUpdate({ _id: inviteId }, { used: true });

  return await getInviteObjectById(inviteId);
}

async function createInviteRequest(address, identifier, country, state) {
  validateAddress(address);
  let invite = await InviteModel.findOne({ address });
  if (invite) {
    throw new Error("Address already invited");
  }
  invite = new InviteModel({
    identifier,
    address,
    location: `${state}, ${country}`,
  });
  return invite.save();
}

async function getInviteByAddress(address) {
  const invite = await InviteModel.findOne({ address });
  return invite ? getInviteObjectById(invite) : null;
}

module.exports = {
  getInviteObjectById,
  openInvite,
  signInvite,
  confirmInviteUsed,
  createInviteRequest,
  getInviteByAddress,
};
