const Invitation = require("../models/InvitationModel");

async function getInviteById(inviteId) {
  return Invitation.findById(inviteId) //.populate("inviter");
}

async function validateInviteById(inviteId, checkAvailable = true) {
  const invite = await getInviteById(inviteId);
  if (!invite) {
    throw new Error("Invitation not found");
  }
  if (checkAvailable && invite.collector) {
    throw new Error("Invitation already used");
  }
  if (invite.revoked) {
    throw new Error("Invitation revoked");
  }
  return invite;
}

async function viewInvite(inviteId) {
  const invite = await validateInviteById(inviteId);
  if (invite.viewed) {
    return invite;
  }

  await Invitation.findOneAndUpdate({ _id: inviteId }, { viewed: true });
  return await getInviteById(inviteId);
}

async function updateInvite(inviteId, update) {
  return Invitation.findOneAndUpdate({ _id: inviteId }, update);
}

module.exports = {
  validateInviteById,
  getInviteById,
  viewInvite,
  updateInvite,
};
