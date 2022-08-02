import React from "react";
import Wallet from "components/Wallet";
import Header from "components/Header";
import DiamondList from "components/DiamondList";
import ProgressBar from "components/ProgressBar";
import ContractProvider from "layout/ContractProvider";
import WagmiWrapper from "layout/WagmiWrapper";
import useSystemLoader from "hooks/useSystemLoader";
import useMountLogger from "hooks/useMountLogger";

const AppInternal = ({ children }) => {
  const isReady = useSystemLoader()

  useMountLogger('AppInternal')

  return isReady ? (
    <main>{children}</main>
  ) : null
}

const AppLayout = ({ children, showTimeline }) => {

  useMountLogger('AppLayout')

  return (
    <WagmiWrapper>
      <div className="app">
        <Header>
          <ContractProvider>
            <DiamondList />
          </ContractProvider>
          <Wallet />
        </Header>
        <ContractProvider>
          <AppInternal>{children}</AppInternal>
        </ContractProvider>
        {showTimeline && (
          <footer>
            <ProgressBar />
          </footer>
        )}
      </div>
    </WagmiWrapper>
  );
}

export default AppLayout;
