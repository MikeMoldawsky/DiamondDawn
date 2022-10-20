const { createInviteRequest } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  try {
    const { address, twitter, email, note, country, state } = req.body;
    res.send(
      await createInviteRequest(address, twitter, email, note, country, state)
    );
  } catch (e) {
    res.status(500).send(e.message);
  }
};
