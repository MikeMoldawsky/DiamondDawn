const InviteModel = require("./models/InviteModel");
const _ = require("lodash");
const add = require("date-fns/add");

async function createInvite(address, identifier) {
  let invite = await InviteModel.findOne({ address });
  if (invite) {
    throw new Error("Address already invited");
  }
  invite = new InviteModel({ approved: true, address, identifier });
  return invite.save();
}

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

async function getInvites(approved) {
  try {
    const dbInvites = await InviteModel.find({ approved });
    const invites = await Promise.all(_.map(dbInvites, getInviteObjectById));
    return _.orderBy(invites, ["created"], ["desc"]);
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
