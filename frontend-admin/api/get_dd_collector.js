const { getDDCollector } = require("../db/collector-db-manager");

module.exports = async function (req, res) {
  res.send(await getDDCollector());
};
