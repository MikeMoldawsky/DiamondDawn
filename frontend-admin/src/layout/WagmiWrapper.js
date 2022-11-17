import React from "react";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
// import { infuraProvider } from "wagmi/providers/infura";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/dist/index.css";
import { useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";

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

const ContractProvider = ({ children }) => {
  const { ddContractData, ddMineContractData } = useSelector(systemSelector);
  return ddContractData && ddMineContractData ? children : null;
};

function WagmiWrapper({ children }) {
  const { chains, provider } = configureChains(
    [localChain, chain.goerli, chain.mainnet],
    [
      alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_KEY }),
      // infuraProvider({ apiKey: "dbe63b3bdfc84f3abdf38cdc8e22f492" }),
      publicProvider(),
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: "Diamond Dawn",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <ContractProvider>{children}</ContractProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default WagmiWrapper;
