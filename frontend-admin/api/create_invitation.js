const { createInvitation } = require("../db/invitation-db-manager");

module.exports = async function (req, res) {
  try {
    res.send(await createInvitation(req.body));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
