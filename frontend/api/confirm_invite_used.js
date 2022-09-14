const { confirmInviteUsed } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  const { inviteId } = req.body;
  res.send(await confirmInviteUsed(inviteId));
};
