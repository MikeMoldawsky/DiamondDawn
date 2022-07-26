const ContractModel = require("./models/ContractModel");

const DIAMOND_DAWN_CONTRACT_NAME = "DiamondDawn";
const DIAMOND_DAWN_MINE_CONTRACT_NAME = "DiamondDawnMine";

async function updateContractByName(name, address, artifact) {
  try {
    const document = { name, address, artifact };
    await ContractModel.findOneAndUpdate({ name }, document, { upsert: true });
  } catch (e) {
    throw new Error(`Failed to update contract ${name}: ${e}`);
  }
}

async function updateDiamondDawnContract(address, artifact) {
  await updateContractByName(DIAMOND_DAWN_CONTRACT_NAME, address, artifact);
}

async function updateDiamondDawnMineContract(address, artifact) {
  await updateContractByName(DIAMOND_DAWN_MINE_CONTRACT_NAME, address, artifact);
}

async function getDiamondDawnContract() {
  return await getContractByName(DIAMOND_DAWN_CONTRACT_NAME);
}

async function getDiamondDawnMineContract() {
  return await getContractByName(DIAMOND_DAWN_MINE_CONTRACT_NAME);
}

async function getContractByName(name) {
  try {
    const contract = await ContractModel.findOne({ name });
    console.log("Got contract by name", {name, contract})
    return contract;
  } catch (e) {
    console.log(`Failed to get contract ${name}: ${e}`);
  }
}


module.exports = {
  updateDiamondDawnContract,
  updateDiamondDawnMineContract,
  getDiamondDawnContract,
  getDiamondDawnMineContract
};
