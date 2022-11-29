const clientDBPromise = require("../db/client/connection");
const { getConfig } = require("../db/managers/config-db-manager");

module.exports = async function (req, res) {
  try {
    await clientDBPromise;
    const config = await getConfig();
    res.send(JSON.stringify(config));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
