const { getCollectorByAddress } = require("../db/collector-db-manager");

module.exports = async function (req, res) {
  try {
    const start = Date.now();
    const { address } = req.body;
    res.send(await getCollectorByAddress(address));
    console.log(`Execution time: ${Date.now() - start} ms`);
  } catch (e) {
    res.status(500).send(e.message);
  }
};
