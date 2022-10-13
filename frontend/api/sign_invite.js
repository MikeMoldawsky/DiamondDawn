const { signInvite } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  try {
    const { inviteId, address } = req.body;
    res.send(await signInvite(inviteId, address));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
