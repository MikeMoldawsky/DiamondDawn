const { getDiamonds } = require("../../db/diamond-db-manager");

module.exports = async function (req, res) {
  const diamonds = await getDiamonds();
  res.send(JSON.stringify(diamonds));
};
