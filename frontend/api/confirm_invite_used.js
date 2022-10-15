const { confirmInviteUsed } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  try {
    const { inviteId, address } = req.body;
    res.send(await confirmInviteUsed(inviteId, address));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
