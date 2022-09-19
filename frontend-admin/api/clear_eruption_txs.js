const { clearEruptionTxs } = require("../db/config-db-manager");

module.exports = async function (req, res) {
  res.send(await clearEruptionTxs());
};
