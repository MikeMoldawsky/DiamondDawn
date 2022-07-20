const { openInvite } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  const { inviteId, country, state } = req.body;
  const updatedInvite = await openInvite(inviteId, country, state);
  res.send(JSON.stringify({ password: updatedInvite.password }));
};
