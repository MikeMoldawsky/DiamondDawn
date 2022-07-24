const ContractModel = require("./models/ContractModel");

async function updateDiamondDawnContract(address, artifact) {
  try {
    const document = { address, artifact: artifact };
    await ContractModel.findOneAndUpdate({}, document, { upsert: true });
  } catch (e) {
    throw new Error(`Failed to update contract ${e}`);
  }
}

async function getDiamondDawnContract() {
  try {
    return await ContractModel.findOne({});
  } catch (e) {
    console.log(`Failed to get contract`, e);
  }
}

module.exports = {
  updateDiamondDawnContract,
  getDiamondDawnContract,
};
