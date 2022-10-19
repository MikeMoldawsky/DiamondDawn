const { createInvite } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  try {
    const { address, twitter, email } = req.body;
    const invite = await createInvite(address, twitter, email);
    res.send(JSON.stringify(invite));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
