const { createInvite } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  const invite = await createInvite(req.body);
  res.send(JSON.stringify(invite));
};
