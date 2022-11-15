const { getCollectors } = require("../db/collector-db-manager");

module.exports = async function (req, res) {
  res.send(await getCollectors(req.body?.approved));
};
