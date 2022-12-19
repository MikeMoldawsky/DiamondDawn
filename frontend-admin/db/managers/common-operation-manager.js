const Collector = require("../models/CollectorModel");
const add = require("date-fns/add");

async function getCollectorObjectById(collectorId) {
  try {
    const collector = (
      await Collector.findById(collectorId).populate({
        path: "invitedBy",
        populate: {
          path: "createdBy",
          model: "Collector",
        },
      })
    ).toObject();
    if (!collector) return null;

    collector.invitedBy =
      collector.invitedBy?.inviter ||
      collector.invitedBy?.createdBy?.twitter ||
      collector.invitedBy?.createdBy?.email ||
      "";

    if (
      collector.mintWindowStart &&
      process.env.REACT_APP_INVITE_TTL_SECONDS > 0
    ) {
      collector.mintWindowClose = add(collector.mintWindowStart, {
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
      });
    }
    return await getCollectorObjectById(ddCollector._id);
  } catch (e) {
    console.log(`Failed to get DD collector`, e);
  }
}

module.exports = {
  getCollectorObjectById,
  getOrCreateDDCollector,
};
