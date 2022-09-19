const ConfigModel = require("./models/ConfigModel");

async function updateStageTime(timestamp) {
  const dateTime = new Date(timestamp);
  try {
    let config = await ConfigModel.findOne({});
    if (config) {
      return await ConfigModel.findOneAndUpdate({}, { stageTime: dateTime });
    } else {
      return await ConfigModel.create({ stageTime: dateTime });
    }
  } catch (e) {
    console.log(`Failed to updateStageTime`, e);
  }
}

async function logEruptionTx(txHash) {
  try {
    let config = await ConfigModel.findOne({});
    if (config) {
      return await ConfigModel.findOneAndUpdate({}, { $push: { eruptionTxs: txHash } });
    } else {
      return await ConfigModel.create({ eruptionTxs: [txHash] });
    }
  } catch (e) {
    console.log(`Failed to updateStageTime`, e);
  }
}

async function getConfig() {
  try {
    return await ConfigModel.findOne({});
  } catch (e) {
    console.log(`Failed to getConfig`, e);
  }
}

module.exports = {
  updateStageTime,
  logEruptionTx,
  getConfig,
};
