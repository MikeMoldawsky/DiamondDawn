const Collector = require("./models/CollectorModel");
const _ = require("lodash");
const add = require("date-fns/add");

async function getCollectorObjectById(collectorId) {
  try {
    const collector = (await Collector.findById(collectorId)).toObject()
    if (!collector) return null;

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

async function getCollectors(approved) {
  try {
    const dbCollectors = await Collector.find({ approved });
    return await Promise.all(_.map(dbCollectors, ({ _id }) => getCollectorObjectById(_id)));
  } catch (e) {
    console.log(`Failed to get ${approved ? "Approved" : "Pending"} collectors`, e);
  }
}

async function getDDCollector() {
  try {
    const ddCollector = await Collector.findOne({ address: "0xffff" });
    return await getCollectorObjectById(ddCollector._id);
  } catch (e) {
    console.log(`Failed to get DD collector`, e);
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
  getCollectors,
  getDDCollector,
  updateCollector,
};
