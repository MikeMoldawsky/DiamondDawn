import React from "react";
import {
  RainbowKitProvider,
  midnightTheme,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
// import { infuraProvider } from "wagmi/providers/infura";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/styles.css";
import {
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import useWindowDimensions from "hooks/useWindowDimensions";

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
  const { width } = useWindowDimensions()

  const chainByEnv =
    process.env.REACT_APP_ENVIRONMENT === "production"
      ? chain.mainnet
      : process.env.REACT_APP_ENVIRONMENT === "preview"
      ? chain.goerli
      : localChain;
  const { chains, provider } = configureChains(
    [chainByEnv],
    [
      alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_KEY }),
      // infuraProvider({ apiKey: "dbe63b3bdfc84f3abdf38cdc8e22f492" }),
      publicProvider(),
    ]
  );

  const wallets = width >= 768 ? [
    metaMaskWallet({ chains, shimDisconnect: true }),
    coinbaseWallet({ chains, appName: "Diamond Dawn" }),
    walletConnectWallet({ chains }),
  ]: [
    walletConnectWallet({ chains }),
    coinbaseWallet({ chains, appName: "Diamond Dawn" }),
  ]

  const connectors = connectorsForWallets([
    {
      groupName: "Suggested",
      wallets,
    },
  ]);

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={midnightTheme({
          accentColor: "transparent",
          accentColorForeground: "white",
        })}
        modalSize="compact"
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default WagmiWrapper;
