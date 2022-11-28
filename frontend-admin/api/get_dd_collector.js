const clientDBPromise = require("../db/client/connection");
const { getOrCreateDDCollector } = require("../db/managers/common-operation-manager");

module.exports = async function (req, res) {
  try {
    await clientDBPromise;
    res.send(await getOrCreateDDCollector());
  } catch (e) {
    res.status(500).send(e.message);
  }
};
