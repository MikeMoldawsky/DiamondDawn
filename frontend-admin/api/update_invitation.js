const clientDBPromise = require("../db/client/connection");
const { updateInvitation} = require("../db/managers/invitation-db-manager");

module.exports = async function (req, res) {
  try {
    await clientDBPromise;
    const invite = await updateInvitation(req.body);
    res.send(invite);
  } catch (e) {
    res.status(500).send(e.message);
  }
};
