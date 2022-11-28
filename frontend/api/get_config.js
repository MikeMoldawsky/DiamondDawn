const clientDBPromise = require("../db/client/connection");
const { getConfig } = require("../db/managers/config-db-manager");

module.exports = async function (req, res) {
  const start = Date.now();
  await clientDBPromise;
  const config = await getConfig();
  res.send(JSON.stringify(config));
  console.log(`Execution time: ${Date.now() - start} ms`);
};
