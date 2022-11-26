const { getDiamondDawnContract } = require("../db/contract-db-manager");

module.exports = async function (req, res) {
  const start = Date.now();
  const contract = await getDiamondDawnContract();
  const end = Date.now();
  console.log(`Execution time: ${end - start} ms`);
  res.send(JSON.stringify(contract));
};
