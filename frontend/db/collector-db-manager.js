const Collector = require("./models/CollectorModel");
const _ = require("lodash");
const add = require("date-fns/add");

async function getCollectorObjectById(collectorId) {
  try {
    const collector = (await Collector.findById(collectorId)).toObject()
    if (!collector) return null;

    // let expires, expired
    if (collector.mintWindowOpen && process.env.REACT_APP_INVITE_TTL_SECONDS > 0) {
      collector.mintWindowClose = add(collector.mintWindowOpen, {
        seconds: process.env.REACT_APP_INVITE_TTL_SECONDS,
      });

      if (collector.minted || collector.mintWindowClose < new Date()) {
        collector.mintClosed = true;
      }
    }

    return collector;
  } catch (e) {
    console.log(`Failed to get Collector ${collectorId}`, e);
  }
}

async function updateCollector(update) {
  try {
    await Collector.findOneAndUpdate(
      { _id: update._id },
      update,
      { new: true }
    );
    return getCollectorObjectById(update._id);
  } catch (e) {
    console.log(`Failed to UPDATE Invite`, e);
  }
}

module.exports = {
  getCollectorById: getCollectorObjectById,
  updateCollector,
};
