require("dotenv").config();

require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-coverage");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.15",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
          viaIR: true,
        },
      },
    ],
  },
  networks: {
    hardhat: {
      accounts: {
        count: 350,
      },
    },
    goerli: {
      url: process.env.DEV_DEPLOYMENT_GOERLI_URL || "",
      accounts:
        process.env.DEV_DEPLOYMENT_DEPLOYER_PRIVATE_KEY !== undefined
          ? [process.env.DEV_DEPLOYMENT_DEPLOYER_PRIVATE_KEY]
          : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.DEV_DEPLOYMENT_ETHERSCAN_API_KEY,
      goerli: process.env.DEV_DEPLOYMENT_ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "goerli",
        chainId: 5,
        urls: {
          apiURL: "https://api-goerli.etherscan.io/api",
          browserURL: "https://goerli.etherscan.io",
        },
      },
    ],
  },
};
