const { confirmMinted } = require("../db/collector-db-manager");

module.exports = async function (req, res) {
  try {
    const start = Date.now();
    const { collectorId, address } = req.body;
    res.send(await confirmMinted(collectorId, address));
    console.log(`Execution time: ${Date.now() - start} ms`);
  } catch (e) {
    res.status(500).send(e.message);
  }
};
