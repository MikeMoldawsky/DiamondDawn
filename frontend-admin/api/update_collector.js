const { updateCollector } = require("../db/collector-db-manager");

module.exports = async function (req, res) {
  res.send(await updateCollector(req.body));
};
