const { createInviteRequest } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  try {
    const { identifier, address, country, state } = req.body;
    res.send(await createInviteRequest(address, identifier, country, state));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
