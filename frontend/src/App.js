import React, { useEffect, useRef, useState } from "react";
import "./css/app.scss";
import classNames from "classnames";
import Wallet from "pages/Wallet";
import Header from "components/Header";
import WagmiWrapper from 'layout/WagmiWrapper'
import AdminPanel from 'components/AdminPanel'

function App() {

  return (
    <WagmiWrapper>
      <div className={classNames("app")}>
        <Header>
          <Wallet />
        </Header>
        <AdminPanel />
      </div>
    </WagmiWrapper>
  );
}

export default App;
