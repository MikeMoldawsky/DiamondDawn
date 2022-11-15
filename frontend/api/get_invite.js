const { getInviteById } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  try {
    const { inviteId } = req.body;
    res.send(await getInviteById(inviteId));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
