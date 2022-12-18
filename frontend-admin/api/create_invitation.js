const clientDBPromise = require("../db/client/connection");
const {
  getOrCreateDDCollector,
} = require("../db/managers/common-operation-manager");
const { createInvitations } = require("../db/managers/invitation-db-manager");

module.exports = async function (req, res) {
  try {
    await clientDBPromise;
    const { note, inviter, count } = req.body;
    const ddCollector = await getOrCreateDDCollector();
    res.send(await createInvitations(ddCollector, note, inviter, count));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
