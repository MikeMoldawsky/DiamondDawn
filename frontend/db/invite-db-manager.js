const InviteModel = require("./models/InviteModel");
const add = require("date-fns/add");
const ethers = require("ethers");
const signer = require("../helpers/signer")

async function getInviteObjectById(inviteId) {
  try {
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
  } catch (e) {
    console.log(`Failed to get invite ${inviteId}`, e);
  }
}

async function openInvite(inviteId, country, state) {
  try {
    // check that the invite exist and not revoked or expired
    const invite = await getInviteObjectById(inviteId);
    if (!invite || invite.used || invite.revoked || !invite.approved) {
      console.log("openInvite - Invalid invite", invite);
      return null;
    }

    await InviteModel.findOneAndUpdate(
      { _id: inviteId },
      {
        opened: invite.opened || Date.now(),
        location: `${state}, ${country}`,
      }
    );

    return await getInviteObjectById(inviteId);
  } catch (e) {
    console.log(`Failed to create invite`, e);
  }
}

async function signInvite(inviteId, address) {
  if (!ethers.utils.isAddress(address)) {
    throw new Error(
      `Invalid Ethereum address - "${address}"`
    );
  }

  // check that the invite exist and not revoked or expired
  const invite = await getInviteObjectById(inviteId);
  if (!invite || invite.revoked || invite.used || !invite.approved) {
    throw new Error(`Invalid invite`);
  }

  if (address !== invite.address) {
    throw new Error(`Wrong Ethereum address`);
  }

  const signature = await signer.signAddress(address);

  return { invite, signature };
}

async function confirmInviteUsed(inviteId) {
  try {
    // check that the invite exist and not revoked or expired
    const invite = await getInviteObjectById(inviteId);
    if (!invite || invite.revoked) {
      console.log("confirmInviteUsed - invite not found or revoked", {
        inviteId,
      });
      return null;
    }

    await InviteModel.findOneAndUpdate({ _id: inviteId }, { used: true });

    return await getInviteObjectById(inviteId);
  } catch (e) {
    console.log(`Failed to create invite`, e);
  }
}

async function createInviteRequest(address, identifier, country, state) {
  if (!ethers.utils.isAddress(address)) {
    throw new Error(`Invalid Ethereum address - "${address}"`);
  }
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
