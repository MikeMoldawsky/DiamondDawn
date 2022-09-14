const InviteModel = require("./models/InviteModel");
const _ = require('lodash')
const add = require("date-fns/add");

async function createInvite() {
  try {
    const invite = new InviteModel({});
    return await invite.save();
  } catch (e) {
    console.log(`Failed to create invite`, e);
  }
}

function getInviteObject(inviteModel) {
  try {
    const invite = inviteModel.toObject();
    const ttl = parseInt(process.env.REACT_APP_INVITE_TTL_SECONDS)
    if (
      invite
      && invite.opened
      && ttl > 0) {

      invite.expires = add(invite.opened, { seconds: ttl })

      if (invite.expires < new Date()) {
        invite.revoked = true
      }
    }

    return invite
  }
  catch (e) {
    console.log(`Failed to get invite ${getInviteObject._id}`, e);
  }
}

async function getInvites() {
  try {
    const invites = await InviteModel.find();
    return _.map(invites, getInviteObject)
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
