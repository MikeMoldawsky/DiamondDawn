import Onboard from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import tweezers_logo from "../tweezers_logo.png";

// const ETH_MAINNET_RPC = process.env.REACT_APP_ETH_URL;
// const ETH_RINKEBY_RPC = process.env.REACT_APP_RINKEBY_URL;
// const ETH_ROPSTEN_RPC = process.env.REACT_APP_ROPSTEN_URL;

const ETH_MAINNET_RPC = "https://mainnet.infura.io/v3/dbe63b3bdfc84f3abdf38cdc8e22f492";
const ETH_RINKEBY_RPC = "https://rinkeby.infura.io/v3/dbe63b3bdfc84f3abdf38cdc8e22f492";
const ETH_ROPSTEN_RPC = "https://ropsten.infura.io/v3/dbe63b3bdfc84f3abdf38cdc8e22f492";


const injected = injectedModule()

const onboard = Onboard({
  wallets: [injected],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: ETH_MAINNET_RPC
    },
    {
      id: '0x3',
      token: 'tROP',
      label: 'Ethereum Ropsten Testnet',
      rpcUrl: ETH_ROPSTEN_RPC
    },
    {
      id: '0x4',
      token: 'rETH',
      label: 'Ethereum Rinkeby Testnet',
      rpcUrl: ETH_RINKEBY_RPC
    }
  ],
  appMetadata: {
    name: 'Tweezers',
    icon: tweezers_logo,
    description: 'Swap tokens for other tokens',
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io' },
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
    ]
  },
  i18n: {
    en: {
      connect: {
        selectingWallet: {
          header: 'custom text header'
        }
      }
    }
  }
})

export default onboard;
