const clientDBPromise = require("../db/client/connection");
const {
  getOrCreateDDCollector,
} = require("../db/managers/common-operation-manager");
const { createInvitations } = require("../db/managers/invitation-db-manager");

module.exports = async function (req, res) {
  try {
    await clientDBPromise;
    const { invitation, count } = req.body;
    const ddCollector = await getOrCreateDDCollector();
    res.send(await createInvitations(invitation, ddCollector, count));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
