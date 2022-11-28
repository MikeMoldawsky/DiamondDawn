const { getCollectorById } = require("../db/collector-db-manager");

module.exports = async function (req, res) {
  const start = Date.now();
  res.send(await getCollectorById(req.body?.id));
  console.log(`Execution time: ${Date.now() - start} ms`);
};
