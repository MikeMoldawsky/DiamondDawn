const { createInvitation } = require("../db/invitation-db-manager");

module.exports = async function (req, res) {
  try {
    const { createdBy, note } = req.body
    res.send(await createInvitation(createdBy, note));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
