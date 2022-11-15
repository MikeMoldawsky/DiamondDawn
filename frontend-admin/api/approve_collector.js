const { approveCollector } = require("../db/collector-db-manager");

module.exports = async function (req, res) {
  try {
    const { collectorId } = req.body
    res.send(await approveCollector(collectorId));
  }
  catch (e) {
    res.status(500).send(e.message);
  }
};
