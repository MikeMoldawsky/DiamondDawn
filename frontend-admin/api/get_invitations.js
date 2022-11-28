const clientDBPromise = require("../db/client/connection");
const { getInvitations} = require("../db/managers/invitation-db-manager");

module.exports = async function (req, res) {
  try {
    await clientDBPromise;
    res.send(await getInvitations(req.body?.approved));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
