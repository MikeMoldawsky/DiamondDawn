const { createInvitation } = require("../db/invitation-db-manager");

module.exports = async function (req, res) {
  try {
    const { createdBy, note, inviter } = req.body;
    res.send(await createInvitation(createdBy, note, inviter));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
