const { updateCollector } = require("../db/collector-db-manager");

module.exports = async function (req, res) {
  try {
    res.send(await updateCollector(req.body));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
