const signer = require("../helpers/signer");

module.exports = async function (req, res) {
  const { address, tokenId } = req.body;
  try {
    res.send(await signer.signAddressAndTokenId(address, tokenId));
  } catch (e) {
    res.status(500).send(e.message);
  }
};
