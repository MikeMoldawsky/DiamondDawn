const { updateInvitation } = require("../db/invitation-db-manager");

module.exports = async function (req, res) {
  const invite = await updateInvitation(req.body);
  res.send(invite);
};
