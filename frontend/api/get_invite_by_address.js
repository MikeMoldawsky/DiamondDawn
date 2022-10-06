const { getInviteByAddress } = require("../db/invite-db-manager");

module.exports = async function (req, res) {
  try {
    const { address } = req.body;
    res.json(await getInviteByAddress(address));
  }
  catch (e) {
    res.status(500).send(e.message)
  }
};
