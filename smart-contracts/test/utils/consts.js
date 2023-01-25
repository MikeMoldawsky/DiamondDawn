const { parseEther } = require("ethers/lib/utils");

// constants from contract
const BASE_URI = "ar://";

// constants for tests
const MINT_MANIFEST = "mine-manifest";
const KEY_MANIFEST = "key-manifest";
// tokens
const PRICE_MINT = parseEther("0");
const PRICE_KEY = parseEther("0");
const MAX_TOKENS = 5555;

module.exports = {
  BASE_URI,
  MINT_MANIFEST,
  KEY_MANIFEST,
  PRICE_MINT,
  PRICE_KEY,
  MAX_TOKENS,
};
