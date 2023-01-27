const clientDBPromise = require("../db/client/connection");
const { createCollector } = require("../db/managers/collector-db-manager");
const {
   validateInviteById,
  updateInvite,
} = require("../db/managers/invite-db-manager");
const { onApplicationSubmitted } = require("../db/managers/marketing-manager");

module.exports = async function (req, res) {
  try {
    const start = Date.now();
    await clientDBPromise;
    let { inviteId, ...payload } = req.body;


    let invite = await validateInviteById(inviteId);
    const { honoraryInvitee, trustedInvitee, numNFTs, note } = invite


    let collector = await createCollector({
      ...payload,
      invitedBy: invite,
      honorary: honoraryInvitee,
      trusted: trustedInvitee,
      numNFTs,
      note,
    });

    invite = await updateInvite(inviteId, { collector })

    await onApplicationSubmitted(collector);
    res.send({ collector, invite });
    console.log(`Execution time: ${Date.now() - start} ms`);
  } catch (e) {
    res.status(500).send(e.message);
  }
};
