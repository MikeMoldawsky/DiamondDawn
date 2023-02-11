const Collector = require("../models/CollectorModel");
const ethers = require("ethers");
const signer = require("../../helpers/signer");

async function getCommunityMembers() {
  try {
    return await Collector
      .find({
        approved: true,
        address: { $ne: "0xffff" },
        twitter: { $exists: true }
      })
      .sort({
        createdAt: -1,
      });
  } catch (e) {
    console.log(
      `Failed to get collectors`,
      e
    );
  }
}

async function getCollectorById(collectorId) {
  try {
    return await Collector.findById(collectorId)
      .populate("invitedBy")
      .populate("invitations");
  } catch (e) {
    console.log(`Failed to get Collector ${collectorId}`, e);
  }
}

async function getCollectorByAddress(address) {
  const invite = await Collector.findOne({ address });
  return invite ? getCollectorById(invite._id) : null;
}

function validateAddress(address) {
  if (!ethers.utils.isAddress(address)) {
    throw new Error("Invalid Ethereum address");
  }
}

function validateCollector(collector, address, requireApproved = true) {
  if (!collector) {
    throw new Error("Collector not found");
  }
  if (address !== collector.address) {
    throw new Error(`Wrong Ethereum address`);
  }
  if (requireApproved && !collector.approved) {
    throw new Error("Collector pending approval");
  }
}

async function createCollector(payload) {
  const { address, location } = payload;
  validateAddress(address);
  let collector = await Collector.findOne({ address });
  if (collector) {
    throw new Error("Collector with this address already exists");
  }
  collector = new Collector({
    ...payload,
    location: location || "Unknown",
  });
  return collector.save();
}

async function updateCollector(update) {
  try {
    await Collector.findOneAndUpdate({ _id: update._id }, update, {
      new: true,
    });
    return getCollectorById(update._id);
  } catch (e) {
    console.log(`Failed to UPDATE Invite`, e);
  }
}

async function signMint(collectorId, address, isHonorary) {
  validateAddress(address);
  const collector = await getCollectorById(collectorId);
  validateCollector(collector, address);

  const signature = await (isHonorary
    ? signer.signAddress(address)
    : signer.signAddressAndNumNFTs(address, collector.numNFTs));

  return { collector, signature };
}

async function changeMintAddress(collectorId, address, newAddress) {
  validateAddress(address);
  const collector = await getCollectorById(collectorId);
  validateCollector(collector, address, false);
  const newAddressCollector = await Collector.findOne({ address: newAddress });
  if (newAddressCollector) {
    throw new Error("Address already registered");
  }

  await Collector.findOneAndUpdate(
    { _id: collectorId },
    {
      address: newAddress,
    }
  );

  return await getCollectorById(collectorId);
}

module.exports = {
  getCommunityMembers,
  getCollectorById,
  getCollectorByAddress,
  createCollector,
  updateCollector,
  signMint,
  changeMintAddress,
};
