const clientDBPromise = require("../db/client/connection")
const { getDiamondDawnContract } = require("../db/managers/contract-db-manager");

module.exports = async function (req, res) {
  const start = Date.now();
  await clientDBPromise;
  const contract = await getDiamondDawnContract();
  res.send(JSON.stringify(contract));
  console.log(`Execution time: ${Date.now() - start} ms`);
};
