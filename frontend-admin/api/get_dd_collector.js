const { getOrCreateDDCollector } = require("../db/common");

module.exports = async function (req, res) {
  res.send(await getOrCreateDDCollector());
};
