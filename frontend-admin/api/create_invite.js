const { createInvite } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  try {
    const { address, identity } = req.body
    const invite = await createInvite(address, identity);
    res.send(JSON.stringify(invite));
  }
  catch (e) {
    res.status(500).send(e.message);
  }
};
