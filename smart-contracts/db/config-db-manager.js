const ConfigModel = require("./models/ConfigModel");

async function clearEruptionTxs() {
  try {
    return await ConfigModel.findOneAndUpdate({}, { eruptionTxs: [] });
  } catch (e) {
    console.log(`Failed to clearEruptionTxs`, e);
  }
}

module.exports = {
  clearEruptionTxs,
};
