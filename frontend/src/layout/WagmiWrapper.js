import React from "react";
import { getDefaultWallets, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/dist/index.css";

const localChain = {
  id: 31337,
  name: 'Local',
  network: 'local',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: 'http://localhost:8545',
  },
  testnet: true,
}

function WagmiWrapper({ children }) {

  const { chains, provider } = configureChains(
    [localChain],
    [
      infuraProvider({ infuraId: "dbe63b3bdfc84f3abdf38cdc8e22f492" }),
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
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default WagmiWrapper;
