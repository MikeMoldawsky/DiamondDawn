const { getDiamondDawnContract } = require("../db/contract-db-manager");

module.exports = async function (req, res) {
  const start = Date.now();
  const contract = await getDiamondDawnContract();
  res.send(JSON.stringify(contract));
  console.log(`Execution time: ${Date.now() - start} ms`);
};
