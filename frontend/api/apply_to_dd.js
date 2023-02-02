const clientDBPromise = require("../db/client/connection");
const {
  createCollector,
  updateCollector,
} = require("../db/managers/collector-db-manager");
const {
  validateInviteById,
  updateInvite,
  createInvitations,
} = require("../db/managers/invite-db-manager");
const { onApplicationSubmitted } = require("../db/managers/marketing-manager");

module.exports = async function (req, res) {
  try {
    const start = Date.now();
    await clientDBPromise;
    let { inviteId, ...payload } = req.body;

    let invite = await validateInviteById(inviteId);
    const { inviter, honoraryInvitee, trustedInvitee, numNFTs, note } = invite;

    const approved = inviter.trusted;

    let collector = await createCollector({
      ...payload,
      invitedBy: invite,
      honorary: honoraryInvitee,
      trusted: honoraryInvitee || trustedInvitee,
      numNFTs,
      note,
      approved,
      status: approved ? "Approved" : "Applied",
    });

    if (approved) {
      const noteName = collector.twitter || collector.address;
      const [i1] = await createInvitations(
        { note: `${noteName} - Invite 1` },
        collector
      );
      const [i2] = await createInvitations(
        { note: `${noteName} - Invite 2` },
        collector
      );
      collector = await updateCollector({
        _id: collector._id,
        invitations: [i1, i2],
      });
    }

    await updateInvite(inviteId, { collector });

    await onApplicationSubmitted(collector);
    res.send(collector);
    console.log(`Execution time: ${Date.now() - start} ms`);
  } catch (e) {
    res.status(500).send(e.message);
  }
};
