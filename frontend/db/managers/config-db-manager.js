const ConfigModel = require("../models/ConfigModel");

async function getConfig() {
  try {
    return await ConfigModel.findOne({});
  } catch (e) {
    console.log(`Failed to getConfig`, e);
  }
}

module.exports = {
  getConfig,
};
