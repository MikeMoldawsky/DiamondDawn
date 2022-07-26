const { createDiamond } = require("../../db/diamond-db-manager");

module.exports = async function (req, res) {
  const diamond = await createDiamond(req.body);
  res.send(diamond);
};
