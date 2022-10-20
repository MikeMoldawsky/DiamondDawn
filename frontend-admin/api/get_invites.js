const { getInvites } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  const invites = await getInvites(req.body?.approved);
  res.send(invites);
};
