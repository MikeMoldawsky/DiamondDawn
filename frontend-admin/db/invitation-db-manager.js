const Invitation = require("./models/InvitationModel");
const Collector = require("./models/CollectorModel");

const MAX_INVITES_FOR_COLLECTOR = 2
const DD_TWITTER_HANDLE = "@DiamondDawnNFT"

async function createInvitation({createdBy, note}) {
  const inviter = await Collector.findById(createdBy)
  let inviterInvitations = await Invitation.count({ createdBy });
  if (inviterInvitations >= MAX_INVITES_FOR_COLLECTOR && inviter.twitter !== DD_TWITTER_HANDLE) {
    throw new Error("Invitation limit reached");
  }

  const invitation = new Invitation({ createdBy, note });
  return invitation.save();
}

async function getInvitationObjectById(inviteId) {
  try {
    return await Invitation.findById(inviteId)
  } catch (e) {
    console.log(`Failed to get invite ${inviteId}`, e);
  }
}

async function getInvitations() {
  try {
    return await Invitation.find();
  } catch (e) {
    console.log(`Failed to get all invites`, e);
  }
}

async function updateInvitation(update) {
  try {
    await Invitation.findOneAndUpdate(
      { _id: update._id },
      update,
      { new: true }
    );
    return getInvitationObjectById(update._id)
  } catch (e) {
    console.log(`Failed to UPDATE Invitation`, e);
  }
}

module.exports = {
  createInvitation,
  getInvitations,
  updateInvitation,
};