import React, { useEffect, useRef, useState } from "react";
import "./css/app.scss";
import classNames from "classnames";
import Wallet from "pages/Wallet";
import Header from "components/Header";
import WagmiWrapper from 'layout/WagmiWrapper'

function App() {

  return (
    <WagmiWrapper>
      <div className={classNames("app")}>
        <Header>
          <Wallet />
        </Header>
      </div>
    </WagmiWrapper>
  );
}

export default App;
