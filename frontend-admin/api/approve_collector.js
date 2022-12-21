const clientDBPromise = require("../db/client/connection");
const { approveCollector } = require("../db/managers/collector-db-manager");
const { onApplicationApproved } = require("../db/managers/marketing-manager");

module.exports = async function (req, res) {
  try {
    await clientDBPromise;
    const { collectorId } = req.body;
    const collector = await approveCollector(collectorId);
    await onApplicationApproved(collector);

    res.send(collector);
  } catch (e) {
    res.status(500).send(e.message);
  }
};
