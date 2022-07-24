const { updateDiamond } = require("../db/diamond-db-manager");

module.exports = async function (req, res) {
  const diamond = await updateDiamond(req.body);
  res.send(diamond);
};
