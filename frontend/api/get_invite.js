const { getInviteObjectById } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  try {
    const { inviteId } = req.body;
    res.send(await getInviteObjectById(inviteId));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
