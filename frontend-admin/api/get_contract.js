const {
  getDiamondDawnContract,
  getDiamondDawnMineContract,
} = require("../db/contract-db-manager");

module.exports = async function (req, res) {
  const [ddContract, ddMineContract] = await Promise.all([
    getDiamondDawnContract(),
    getDiamondDawnMineContract(),
  ]);
  res.send(JSON.stringify({ ddContract, ddMineContract }));
};
