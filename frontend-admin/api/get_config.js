const { getConfig } = require("../db/config-db-manager");

module.exports = async function (req, res) {
  const config = await getConfig();
  res.send(JSON.stringify(config));
};
