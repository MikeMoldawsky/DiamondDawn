const clientDBPromise = require("../db/client/connection");
const { clearEruptionTxs } = require("../db/managers/config-db-manager");

module.exports = async function (req, res) {
  try {
    await clientDBPromise;
    res.send(await clearEruptionTxs());
  } catch (e) {
    res.status(500).send(e.message);
  }
};
