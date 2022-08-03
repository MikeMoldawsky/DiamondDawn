const ContractModel = require("./models/ContractModel");

const DIAMOND_DAWN_CONTRACT_NAME = "DiamondDawn";
const DIAMOND_DAWN_MINE_CONTRACT_NAME = "DiamondDawnMine";

async function updateDiamondDawnContract(address, artifact) {
  await updateContractByName(DIAMOND_DAWN_CONTRACT_NAME, address, artifact);
}

async function updateDiamondDawnMineContract(address, artifact) {
  await updateContractByName(
    DIAMOND_DAWN_MINE_CONTRACT_NAME,
    address,
    artifact
  );
}

async function updateContractByName(name, address, artifact) {
  try {
    const document = { name, address, artifact };
    await ContractModel.findOneAndUpdate({ name }, document, { upsert: true });
  } catch (e) {
    throw new Error(`Failed to update contract ${name}: ${e}`);
  }
}

module.exports = {
  updateDiamondDawnContract,
  updateDiamondDawnMineContract,
};
