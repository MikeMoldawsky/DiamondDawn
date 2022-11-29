const clientDBPromise = require("../db/client/connection");
const { logEruptionTx } = require("../db/managers/config-db-manager");

module.exports = async function (req, res) {
  try {
    await clientDBPromise;
    const { txHash } = req.body;
    res.send(await logEruptionTx(txHash));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
