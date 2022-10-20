const { openInvite } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  try {
    const { inviteId, address, country, state } = req.body;
    res.send(await openInvite(inviteId, address, country, state));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
