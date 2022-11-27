require("./db");
const Collector = require("./models/CollectorModel");
const _ = require("lodash");
const { createInvitation } = require("./invitation-db-manager");
const { getCollectorObjectById } = require("./common");

async function getCollectors(approved) {
  try {
    const dbCollectors = await Collector.find({ approved });
    return await Promise.all(
      _.map(dbCollectors, ({ _id }) => getCollectorObjectById(_id))
    );
  } catch (e) {
    console.log(
      `Failed to get ${approved ? "Approved" : "Pending"} collectors`,
      e
    );
  }
}

async function updateCollector(update) {
  await Collector.findOneAndUpdate({ _id: update._id }, update, {
    new: true,
  });
  return getCollectorObjectById(update._id);
}

async function approveCollector(collectorId) {
  const collector = await Collector.findById(collectorId);
  if (!collector) {
    throw new Error(`Collector ${collectorId} not found`);
  }

  const update = {
    _id: collectorId,
    approved: true,
  };
  if (collector.invitations.length === 0) {
    const noteName = collector.twitter || collector.address;
    const i1 = await createInvitation(collector, `${noteName} - Invite 1`);
    const i2 = await createInvitation(collector, `${noteName} - Invite 2`);
    update.invitations = [i1, i2];
  }
  return updateCollector(update);
}

module.exports = {
  getCollectors,
  updateCollector,
  approveCollector,
};
