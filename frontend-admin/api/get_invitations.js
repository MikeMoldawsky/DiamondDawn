const { getInvitations } = require("../db/invitation-db-manager");

module.exports = async function (req, res) {
  res.send(await getInvitations(req.body?.approved));
};
