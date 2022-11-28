const clientDBPromise = require("../db/client/connection");
const { createInvitation } = require("../db/managers/invitation-db-manager");

module.exports = async function (req, res) {
  try {
    await clientDBPromise;
    const { createdBy, note, inviter } = req.body;
    res.send(await createInvitation(createdBy, note, inviter));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
