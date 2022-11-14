const { createCollector } = require("../db/collector-db-manager");
const { useInvite } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  try {
    const { inviteId, address, twitter, email, note, country, state } = req.body;
    const collector = await createCollector(address, twitter, email, note, country, state)
    const invite = await useInvite(inviteId, collector.id)
    res.send({ collector, invite });
  } catch (e) {
    res.status(500).send(e.message);
  }
};
