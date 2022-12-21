const clientDBPromise = require("../db/client/connection");
const {
  createCollector,
  updateCollector,
} = require("../db/managers/collector-db-manager");
const {
  useInvite,
  validateInviteById,
} = require("../db/managers/invite-db-manager");
const {
  onApplicationSubmitted,
} = require("../db/managers/marketing-manager");

module.exports = async function (req, res) {
  try {
    const start = Date.now();
    await clientDBPromise;
    const { inviteId, address, twitter, email, note, location, isDao } =
      req.body;
    await validateInviteById(inviteId);
    let collector = await createCollector(
      address,
      twitter,
      email,
      note,
      location,
      isDao
    );
    const invite = await useInvite(inviteId, collector.id);
    collector = await updateCollector({
      _id: collector._id,
      invitedBy: invite,
    });
    await onApplicationSubmitted(collector)
    res.send({ collector, invite });
    console.log(`Execution time: ${Date.now() - start} ms`);
  } catch (e) {
    res.status(500).send(e.message);
  }
};
