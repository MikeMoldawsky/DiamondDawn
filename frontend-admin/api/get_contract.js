const { getDiamondDawnContract } = require("../../db/contract-db-manager");

module.exports = async function (req, res) {
  const contract = await getDiamondDawnContract();
  res.send(JSON.stringify(contract));
};
