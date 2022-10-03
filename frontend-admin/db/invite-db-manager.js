const InviteModel = require("./models/InviteModel");
const SignatureModel = require("./models/SignatureModel");
const _ = require("lodash");
const add = require("date-fns/add");
const isEmpty = require('lodash/isEmpty')

async function createInvite() {
  try {
    const invite = new InviteModel({ approved: true });
    return await invite.save();
  } catch (e) {
    console.log(`Failed to create invite`, e);
  }
}

async function getSignatureByAddress(address) {
  return await SignatureModel.findOne({ address });
}

async function getInviteObjectById(inviteId) {
  try {
    const invite = (await InviteModel.findById(inviteId)).toObject();
    if (!invite) return invite

    if (invite.address) {
      const signature = await getSignatureByAddress(invite.address);
      invite.signed = !isEmpty(signature)
    }

    if (
      invite.opened &&
      process.env.REACT_APP_INVITE_TTL_SECONDS > 0
    ) {
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

async function getInvites(approved) {
  try {
    const invites = await InviteModel.find({ approved });
    return await Promise.all(_.map(invites, getInviteObjectById))
  } catch (e) {
    console.log(`Failed to get all invites`, e);
  }
}

async function updateInvite(inviteProps) {
  try {
    return await InviteModel.findOneAndUpdate(
      { _id: inviteProps._id },
      inviteProps,
      { new: true }
    );
  } catch (e) {
    console.log(`Failed to UPDATE Invite`, e);
  }
}

async function deleteInvite(inviteId) {
  try {
    return await InviteModel.findOneAndDelete({ _id: inviteId });
  } catch (e) {
    console.log(`Failed to DELETE Invite`, e);
  }
}

module.exports = {
  createInvite,
  getInvites,
  updateInvite,
  deleteInvite,
};
