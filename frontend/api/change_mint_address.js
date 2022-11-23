const { changeMintAddress } = require("../db/collector-db-manager");

module.exports = async function (req, res) {
  try {
    const { collectorId, address, newAddress } = req.body;
    res.send(await changeMintAddress(collectorId, address, newAddress));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
