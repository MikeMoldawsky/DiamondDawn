const { getInviteByAddress } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  const { address } = req.body;
  res.send(await getInviteByAddress(address));
};
