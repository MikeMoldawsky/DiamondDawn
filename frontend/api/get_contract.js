const clientDBPromise = require("../db/client/connection");
const {
  getDiamondDawnContract,
  getDiamondDawnMineContract,
} = require("../db/managers/contract-db-manager");

module.exports = async function (req, res) {
  const start = Date.now();
  await clientDBPromise;
  const [ddContract, ddMineContract] = await Promise.all([
    getDiamondDawnContract(),
    getDiamondDawnMineContract(),
  ]);
  res.send({ ddContract, ddMineContract });
  console.log(`Execution time: ${Date.now() - start} ms`);
};
