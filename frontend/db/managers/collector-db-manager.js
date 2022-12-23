const Collector = require("../models/CollectorModel");
const add = require("date-fns/add");
const ethers = require("ethers");
const signer = require("../../helpers/signer");

async function getCollectorObjectById(collectorId) {
  try {
    const collector = (
      await Collector.findById(collectorId)
        .populate({
          path: "invitations",
          populate: "usedBy",
        })
        .populate({
          path: "invitedBy",
          populate: "createdBy",
        })
    ).toObject();
    if (!collector) return null;

    if (
      collector.mintWindowStart &&
      process.env.REACT_APP_INVITE_TTL_SECONDS > 0
    ) {
      collector.mintWindowClose = add(collector.mintWindowStart, {
        seconds: process.env.REACT_APP_INVITE_TTL_SECONDS,
      });

      console.log("getCollectorObjectById", collector);
      if (collector.minted || collector.mintWindowClose < new Date()) {
        collector.mintClosed = true;
      }
    }

    return collector;
  } catch (e) {
    console.log(`Failed to get Collector ${collectorId}`, e);
  }
}

async function getCollectorByAddress(address) {
  const invite = await Collector.findOne({ address });
  return invite ? getCollectorObjectById(invite._id) : null;
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
  // if (collector.minted) {
  //   throw new Error("collector already minted");
  // }
  if (requireApproved && !collector.approved) {
    throw new Error("Collector pending approval");
  }
}

async function createCollector(address, twitter, email, note, location, isDao) {
  validateAddress(address);
  let collector = await Collector.findOne({ address });
  if (collector) {
    throw new Error("Collector with this address already exists");
  }
  collector = new Collector({
    address,
    twitter,
    email,
    note,
    location: location || "Unknown",
    isDao,
  });
  return collector.save();
}

async function updateCollector(update) {
  try {
    await Collector.findOneAndUpdate({ _id: update._id }, update, {
      new: true,
    });
    return getCollectorObjectById(update._id);
  } catch (e) {
    console.log(`Failed to UPDATE Invite`, e);
  }
}

async function openMintWindow(collectorId, address) {
  validateAddress(address);
  const collector = await getCollectorObjectById(collectorId);
  validateCollector(collector, address);

  await Collector.findOneAndUpdate(
    { _id: collectorId },
    {
      mintWindowStart: collector.mintWindowStart || Date.now(),
    }
  );

  return await getCollectorObjectById(collectorId);
}

async function signMint(collectorId, address) {
  validateAddress(address);
  const collector = await getCollectorObjectById(collectorId);
  validateCollector(collector, address);

  const signature = await signer.signAddress(address);

  return { collector, signature };
}

async function confirmMinted(collectorId, address) {
  validateAddress(address);
  const collector = await getCollectorObjectById(collectorId);
  validateCollector(collector, address);

  await Collector.findOneAndUpdate({ _id: collectorId }, { minted: true });

  return await getCollectorObjectById(collectorId);
}

async function changeMintAddress(collectorId, address, newAddress) {
  validateAddress(address);
  const collector = await getCollectorObjectById(collectorId);
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

  return await getCollectorObjectById(collectorId);
}

module.exports = {
  getCollectorById: getCollectorObjectById,
  getCollectorByAddress,
  createCollector,
  updateCollector,
  openMintWindow,
  signMint,
  confirmMinted,
  changeMintAddress,
};
