const { openInvite } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  const { inviteId, country, state } = req.body;
  res.send(await openInvite(inviteId, country, state));
};
