const hre = require("hardhat");
const ContractModel = require("./models/ContractModel");

const DIAMOND_DAWN_CONTRACT_NAME = "DiamondDawn";
const DIAMOND_DAWN_MINE_CONTRACT_NAME = "DiamondDawnMine";

async function updateDiamondDawnContract(address) {
  await updateContractByName(DIAMOND_DAWN_CONTRACT_NAME, address);
}

async function updateDiamondDawnMineContract(address) {
  await updateContractByName(DIAMOND_DAWN_MINE_CONTRACT_NAME, address);
}

async function updateContractByName(name, address) {
  try {
    console.log("Updating contract DB", { name, address });
    const artifact = hre.artifacts.readArtifactSync(name);
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
