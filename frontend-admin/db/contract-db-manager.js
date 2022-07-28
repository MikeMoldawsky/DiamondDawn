const ContractModel = require("./models/ContractModel");

const DIAMOND_DAWN_CONTRACT_NAME = "DiamondDawn";
const DIAMOND_DAWN_MINE_CONTRACT_NAME = "DiamondDawnMine";

async function getDiamondDawnContract() {
  return await getContractByName(DIAMOND_DAWN_CONTRACT_NAME);
}

async function getDiamondDawnMineContract() {
  return await getContractByName(DIAMOND_DAWN_MINE_CONTRACT_NAME);
}

async function getContractByName(name) {
  try {
    const contract = await ContractModel.findOne({ name });
    console.log("Got contract by name", {name, address: contract.address})
    return contract;
  } catch (e) {
    console.log(`Failed to get contract ${name}: ${e}`);
  }
}

module.exports = {
  getDiamondDawnContract,
  getDiamondDawnMineContract
};
