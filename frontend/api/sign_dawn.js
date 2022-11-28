const signer = require("../helpers/signer");

module.exports = async function (req, res) {
  const { address, tokenId } = req.body;
  try {
    const start = Date.now();
    res.send(await signer.signAddressAndTokenId(address, tokenId));
    console.log(`Execution time: ${Date.now() - start} ms`);
  } catch (e) {
    res.status(500).send(e.message);
  }
};
