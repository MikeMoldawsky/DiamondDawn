const clientDBPromise = require("../db/client/connection");
const { changeMintAddress } = require("../db/managers/collector-db-manager");

module.exports = async function (req, res) {
  try {
    const start = Date.now();
    await clientDBPromise;
    const { collectorId, address, newAddress } = req.body;
    res.send(await changeMintAddress(collectorId, address, newAddress));
    console.log(`Execution time: ${Date.now() - start} ms`);
  } catch (e) {
    res.status(500).send(e.message);
  }
};
