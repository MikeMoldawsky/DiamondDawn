const { getCollectorByAddress } = require("../db/collector-db-manager");

module.exports = async function (req, res) {
  try {
    const { address } = req.body;
    res.send(await getCollectorByAddress(address));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
