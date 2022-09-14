const { useInvite } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  const { inviteId, ethAddress } = req.body;
  res.send(await useInvite(inviteId, ethAddress));
};
