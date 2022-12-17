const { getOrCreateDDCollector } = require("./common-operation-manager");
const Invitation = require("../models/InvitationModel");
const Collector = require("../models/CollectorModel");
const _ = require("lodash");

async function createInvitations(createdBy, note, overrideInviter, count = 1) {
  const ddCollector = await getOrCreateDDCollector();

  const invitations = _.map(Array(count), () => ({
    createdBy: ddCollector,
    note,
    inviter: overrideInviter,
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
    return await Invitation.find();
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
