import React from "react";
import Wallet from "components/Wallet";
import Header from "components/Header";
import DiamondList from "components/DiamondList";
import ProgressBar from "components/ProgressBar";
import ContractProvider from "layout/ContractProvider";
import WagmiWrapper from "layout/WagmiWrapper";
import useSystemLoader from "hooks/useSystemLoader";

const AppInternal = ({ children }) => {
  const isReady = useSystemLoader()

  return isReady ? (
    <main>{children}</main>
  ) : null
}

const AppLayout = ({ children, showTimeline }) => {
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
