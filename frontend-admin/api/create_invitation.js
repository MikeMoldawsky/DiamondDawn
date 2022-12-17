const clientDBPromise = require("../db/client/connection");
const { createInvitations } = require("../db/managers/invitation-db-manager");

module.exports = async function (req, res) {
  try {
    await clientDBPromise;
    const { createdBy, note, inviter, count } = req.body;
    res.send(await createInvitations(createdBy, note, inviter, count));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
