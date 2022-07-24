const { updateInvite } = require("../../db/invite-db-manager");

module.exports = async function (req, res) {
  const invite = await updateInvite(req.body);
  res.send(invite);
};
