const Collector = require("./models/CollectorModel");
const _ = require("lodash");
const add = require("date-fns/add");


async function getCollectorObjectById(collectorId) {
  try {
    const collector = (await Collector.findById(collectorId)).toObject();
    if (!collector) return null;

    if (
      collector.mintWindowOpen &&
      process.env.REACT_APP_INVITE_TTL_SECONDS > 0
    ) {
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

async function getOrCreateDDCollector() {
  try {
    let ddCollector = await Collector.findOne({ address: "0xffff" });
    if (!ddCollector) {
      ddCollector = await Collector.create({
        address: "0xffff",
        twitter: "@DiamondDawnNFT",
        approved: true,
      })
    }
    return await getCollectorObjectById(ddCollector._id);
  } catch (e) {
    console.log(`Failed to get DD collector`, e);
  }
}

module.exports = {
  getCollectorObjectById,
  getOrCreateDDCollector,
}