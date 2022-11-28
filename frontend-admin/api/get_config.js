const clientDBPromise = require("../db/client/connection");
const ConfigModel = require("../models/ConfigModel");

module.exports = async function (req, res) {
  try {
    await clientDBPromise;
    const config = await ConfigModel.findOne({})
    res.send(JSON.stringify(config));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
