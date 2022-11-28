const clientDBPromise = require("../db/client/connection")
const { approveCollector } = require("../db/managers/collector-db-manager");

module.exports = async function (req, res) {
  try {
    await clientDBPromise;
    const { collectorId } = req.body;
    res.send(await approveCollector(collectorId));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
