const { deleteDiamond } = require("../db/diamond-db-manager");

module.exports = async function (req, res) {
  const result = await deleteDiamond(req.body.diamondId);
  res.send(result);
};
