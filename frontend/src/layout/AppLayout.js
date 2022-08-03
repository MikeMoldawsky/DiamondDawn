import React from "react";
import Wallet from "components/Wallet";
import Header from "components/Header";
import DiamondList from "components/DiamondList";
import ProgressBar from "components/ProgressBar";
import useSystemLoader from "hooks/useSystemLoader";
import useMountLogger from "hooks/useMountLogger";

const AppLayout = ({ children, showTimeline }) => {
  const isReady = useSystemLoader();

  useMountLogger("AppLayout");

  return (
    <div className="app">
      <Header>
        <DiamondList />
        <Wallet />
      </Header>
      {isReady ? <main>{children}</main> : null}
      {showTimeline && (
        <footer>
          <ProgressBar />
        </footer>
      )}
    </div>
  );
};

export default AppLayout;
