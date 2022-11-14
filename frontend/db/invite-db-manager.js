const Invitation = require("./models/InvitationModel");

async function getInviteObjectById(inviteId) {
  return Invitation.findById(inviteId).populate("createdBy");
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
async function validateInviteById(inviteId) {
  const invite = await getInviteObjectById(inviteId);
  validateInviteBeforeAction(invite);

}

async function useInvite(inviteId, collectorId) {
  await validateInviteById(inviteId);

  await Invitation.findOneAndUpdate({ _id: inviteId }, { usedBy: collectorId });

  return await getInviteObjectById(inviteId);
}

module.exports = {
  validateInviteById,
  getInviteObjectById,
  useInvite,
};
