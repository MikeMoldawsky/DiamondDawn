const { getOrCreateDDCollector } = require("./common-operation-manager");
const Invitation = require("../models/InvitationModel");
const Collector = require("../models/CollectorModel");
const _ = require("lodash");

async function createInvitations(invitation, inviter, count = 1) {
  const invitations = _.map(Array(count), () => ({
    ...invitation,
    inviter,
  }));

  return await Invitation.insertMany(invitations);
}

async function getInvitationObjectById(inviteId) {
  try {
    return await Invitation.findById(inviteId);
  } catch (e) {
    console.log(`Failed to get invite ${inviteId}`, e);
  }
}

async function getInvitations() {
  try {
    return await Invitation.find().sort({ createdAt: -1 });
  } catch (e) {
    console.log(`Failed to get all invites`, e);
  }
}

async function updateInvitation(update) {
  try {
    await Invitation.findOneAndUpdate({ _id: update._id }, update, {
      new: true,
    });
    return getInvitationObjectById(update._id);
  } catch (e) {
    console.log(`Failed to UPDATE Invitation`, e);
  }
}

module.exports = {
  createInvitations,
  getInvitations,
  updateInvitation,
};
