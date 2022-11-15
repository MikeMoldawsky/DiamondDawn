const { openMintWindow } = require("../db/collector-db-manager");

module.exports = async function (req, res) {
  try {
    const { collectorId, address } = req.body;
    res.send(await openMintWindow(collectorId, address));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
