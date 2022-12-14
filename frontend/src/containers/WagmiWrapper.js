import React from "react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, goerli, localhost } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import useWindowDimensions from "hooks/useWindowDimensions";
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
    default: "http://localhost:8545",
  },
  testnet: true,
};

function WagmiWrapper({ children }) {
  const { width } = useWindowDimensions();

  const chainByEnv =
    process.env.REACT_APP_ENVIRONMENT === "production"
      ? mainnet
      : process.env.REACT_APP_ENVIRONMENT === "preview"
      ? goerli
      : localhost;
  console.log("CHAIBNSSS", chainByEnv);
  const { chains, provider } = configureChains(
    [chainByEnv],
    [
      // walletConnectProvider({ projectId: process.env.REACT_APP_WALLET_CONNECT_KEY }),
      alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_KEY }),
      // infuraProvider({ apiKey: "dbe63b3bdfc84f3abdf38cdc8e22f492" }),
      publicProvider(),
    ]
  );
  console.log("CHAIBNSSS", { chainByEnv, chains });
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
        // projectId={process.env.REACT_APP_WALLET_CONNECT_KEY}
        ethereumClient={ethereumClient}
        themeMode={"dark"}
        themeColor={"default"}
        themeBackground={"gradient"}
        // desktopWallets={[{id: "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96"}]}
      />
    </>
  );
}

export default WagmiWrapper;
