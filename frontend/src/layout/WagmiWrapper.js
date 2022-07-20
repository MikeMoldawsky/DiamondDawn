import React, { useEffect } from "react";
import { getDefaultWallets, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/dist/index.css";
import { useDispatch, useSelector } from "react-redux";
import { setDDContractData, systemSelector } from "store/systemReducer";
import axios from "axios";

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

const ContractProvider = ({ children }) => {

  const { ddContractData } = useSelector(systemSelector)
  const dispatch = useDispatch()

  const getContractData = async () => {
    try {
      const { data } = await axios.get(`/api/get_contract`)
      dispatch(setDDContractData(data))
    }
    catch (e) {
      console.error("Failed to get contract data!!!!", e)
    }
  }

  useEffect(() => {
    if (!ddContractData) {
      getContractData()
    }
  }, [ddContractData])

  return ddContractData ? children : null
}

function WagmiWrapper({ children }) {

  const { chains, provider } = configureChains(
    [chain.goerli, chain.ropsten, localChain],
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
        <ContractProvider>{children}</ContractProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default WagmiWrapper;
