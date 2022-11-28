const clientDBPromise = require("../db/client/connection")
const { getCollectors } = require("../db/managers/collector-db-manager");

module.exports = async function (req, res) {
  try {
    await clientDBPromise;
    res.send(await getCollectors(req.body?.approved));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
