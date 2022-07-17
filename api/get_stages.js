const { getAllStages } = require("../db/stage-db-manager");

module.exports = async function (req, res) {
  const stages = await getAllStages();
  res.send(JSON.stringify(stages));
};
