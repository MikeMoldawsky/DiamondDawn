const { logEruptionTx } = require("../db/config-db-manager");

module.exports = async function (req, res) {
  const { txHash } = req.body;
  res.send(await logEruptionTx(txHash));
};
