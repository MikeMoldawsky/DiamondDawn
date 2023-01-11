const clientDBPromise = require("../db/client/connection");
const { toggleIsMintOpen } = require("../db/managers/config-db-manager");

module.exports = async function (req, res) {
  try {
    await clientDBPromise;
    const { timestamp } = req.body
    res.send(await toggleIsMintOpen(timestamp));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
