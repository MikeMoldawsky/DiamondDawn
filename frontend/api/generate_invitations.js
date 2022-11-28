const clientDBPromise = require("../db/client/connection");
const {
  getCollectorById,
  updateCollector,
} = require("../db/managers/collector-db-manager");
const { createInvitation } = require("../db/managers/invite-db-manager");

module.exports = async function (req, res) {
  try {
    const start = Date.now();
    await clientDBPromise;
    const { collectorId } = req.body;
    let collector = await getCollectorById(collectorId);
    if (!collector) {
      return res.status(500).send("Collector not found");
    }
    const i1 = await createInvitation(
      collector,
      `Collector ${collectorId} - Invite 1`
    );
    const i2 = await createInvitation(
      collector,
      `Collector ${collectorId} - Invite 2`
    );

    collector = await updateCollector({
      _id: collectorId,
      invitations: [i1, i2],
    });
    res.send(collector);
    console.log(`Execution time: ${Date.now() - start} ms`);
  } catch (e) {
    res.status(500).send(e.message);
  }
};
