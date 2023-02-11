const clientDBPromise = require("../db/client/connection");
const { getCommunityMembers } = require("../db/managers/collector-db-manager");

module.exports = async function (req, res) {
  try {
    await clientDBPromise;
    res.send(await getCommunityMembers());
  } catch (e) {
    res.status(500).send(e.message);
  }
};
