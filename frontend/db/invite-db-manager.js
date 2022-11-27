require("./db");
const Invitation = require("./models/InvitationModel");

const MAX_INVITES_FOR_COLLECTOR = 2;

async function createInvitation(createdBy, note) {
  let inviterInvitations = await Invitation.count({ createdBy });
  if (inviterInvitations >= MAX_INVITES_FOR_COLLECTOR) {
    throw new Error("Invitation limit reached");
  }

  const invitation = new Invitation({ createdBy, note });
  return invitation.save();
}

async function getInviteById(inviteId) {
  return Invitation.findById(inviteId).populate("createdBy");
}

function validateInvite(invite) {
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
  const invite = await getInviteById(inviteId);
  validateInvite(invite);
}

async function useInvite(inviteId, collectorId) {
  await validateInviteById(inviteId);

  await Invitation.findOneAndUpdate({ _id: inviteId }, { usedBy: collectorId });

  return await getInviteById(inviteId);
}

module.exports = {
  createInvitation,
  validateInviteById,
  getInviteById,
  useInvite,
};
