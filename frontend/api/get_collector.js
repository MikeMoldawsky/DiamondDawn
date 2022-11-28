const clientDBPromise = require("../db/client/connection");
const { getCollectorById } = require("../db/managers/collector-db-manager");

module.exports = async function (req, res) {
  const start = Date.now();
  await clientDBPromise;
  res.send(await getCollectorById(req.body?.id));
  console.log(`Execution time: ${Date.now() - start} ms`);
};
