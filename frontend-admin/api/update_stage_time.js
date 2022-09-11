const { updateStageTime } = require("../db/config-db-manager");

module.exports = async function (req, res) {
  const { timestamp } = req.body;
  res.send(JSON.stringify(await updateStageTime(timestamp)));
};
