const ConfigModel = require("../models/ConfigModel");
const split = require("lodash/split")
const includes = require("lodash/includes")

async function getConfig() {
  try {
    return await ConfigModel.findOne({})
  } catch (e) {
    console.log(`Failed to getConfig`, e);
  }
}

const WL = split(process.env.WL_ADDRESSES, ",")


async function isMintOpen(address) {
  const config = await ConfigModel.findOne({});
  return {
    isMintOpen: config.mintOpen || includes(WL, address),
    stageTime: config.stageTime,
    offset: config.offset,
  }
}

module.exports = {
  getConfig,
  isMintOpen,
};
