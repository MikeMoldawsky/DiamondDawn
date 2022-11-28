const { getConfig } = require("../db/config-db-manager");

module.exports = async function (req, res) {
  const start = Date.now();
  const config = await getConfig();
  res.send(JSON.stringify(config));
  console.log(`Execution time: ${Date.now() - start} ms`);
};
