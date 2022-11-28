const clientDBPromise = require("../db/client/connection");
const {
  getDiamondDawnContract,
  getDiamondDawnMineContract,
} = require("../db/managers/contract-db-manager");

module.exports = async function (req, res) {
  try {
    await clientDBPromise;
    const [ddContract, ddMineContract] = await Promise.all([
      getDiamondDawnContract(),
      getDiamondDawnMineContract(),
    ]);
    res.send({ ddContract, ddMineContract });
  } catch (e) {
    res.status(500).send(e.message);
  }
};
