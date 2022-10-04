const { createInviteRequest } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  const { identifier, address, country, state } = req.body;
  res.send(await createInviteRequest(identifier, address, country, state));
};
