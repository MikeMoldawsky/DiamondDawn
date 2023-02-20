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
const isEmpty = require("lodash/isEmpty")

module.exports = async function (req, res) {
  try {
    const start = Date.now();
    await clientDBPromise;
    let { inviteId, imageExt, ...payload } = req.body;

    let invite = inviteId ? await validateInviteById(inviteId) : null;

    const { inviter, honoraryInvitee, trustedInvitee, numNFTs = 1 } = invite || {};

    const approved = inviter?.trusted;

    let collector = await createCollector({
      ...payload,
      invitedBy: invite,
      honorary: honoraryInvitee,
      trusted: honoraryInvitee || trustedInvitee,
      numNFTs,
      approved,
      status: approved ? "Approved" : "Applied",
    });

    const update = {}

    if (imageExt) {
      update.image = `${collector._id}.${imageExt}`
    }

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
      update.invitations = [i1, i2]
    }

    if (!isEmpty(update)) {
      collector = await updateCollector({
        _id: collector._id,
        ...update,
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
