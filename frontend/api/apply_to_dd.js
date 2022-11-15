const { createCollector, updateCollector } = require("../db/collector-db-manager");
const { useInvite, validateInviteById } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  try {
    const { inviteId, address, twitter, email, note, country, state } = req.body;
    await validateInviteById(inviteId)
    let collector = await createCollector(address, twitter, email, note, country, state)
    const invite = await useInvite(inviteId, collector.id)
    collector = await updateCollector({
      _id: collector._id,
      invitedBy: invite,
    })
    res.send({ collector, invite });
  } catch (e) {
    res.status(500).send(e.message);
  }
};
