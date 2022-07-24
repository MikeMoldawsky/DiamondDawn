const { deleteInvite } = require("../../db/invite-db-manager");

module.exports = async function (req, res) {
  const result = await deleteInvite(req.body.inviteId);
  res.send(result);
};
