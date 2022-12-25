import React from "react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, goerli, localhost } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";

const localChain = {
  id: 31337,
  name: "Local",
  network: "local",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://localhost:8545"],
    },
  },
  testnet: true,
};

function WagmiWrapper({ children }) {
  const chainByEnv =
    process.env.REACT_APP_ENVIRONMENT === "production"
      ? mainnet
      : process.env.REACT_APP_ENVIRONMENT === "preview"
      ? goerli
      : localChain;

  const providers = [
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_KEY }),
    // infuraProvider({ apiKey: "dbe63b3bdfc84f3abdf38cdc8e22f492" }),
    publicProvider(),
  ];

  if (process.env.REACT_APP_ENVIRONMENT !== "local") {
    providers.unshift(
      walletConnectProvider({
        projectId: process.env.REACT_APP_WALLET_CONNECT_KEY,
      })
    );
  }

  const { chains, provider } = configureChains([chainByEnv], providers);
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: modalConnectors({ appName: "Diamond Dawn", chains }),
    provider,
  });

  // Web3Modal Ethereum Client
  const ethereumClient = new EthereumClient(wagmiClient, chains);

  return (
    <>
      <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
      <Web3Modal
        projectId={process.env.REACT_APP_WALLET_CONNECT_KEY}
        ethereumClient={ethereumClient}
        themeMode={"dark"}
        themeColor={"default"}
        themeBackground={"gradient"}
      />
    </>
  );
}

export default WagmiWrapper;
