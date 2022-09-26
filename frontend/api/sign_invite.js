const { signInvite } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  const { inviteId, ethAddress } = req.body;
  try {
    res.send(await signInvite(inviteId, ethAddress));
  }
  catch (e) {
    res.status(500).send(e.message)
  }
};
