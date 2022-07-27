import React from "react";
import classNames from "classnames";
import 'pages/App/App.scss'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InvitePage from "pages/InvitePage";
import App from "pages/App";
import WagmiWrapper from "layout/WagmiWrapper";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RebirthPage from "pages/RebirthPage";
import NFTPage from "pages/NFTPage";

const MainLayout = () => {
  return (
    <div className={classNames("main-layout")}>
      <WagmiWrapper>
        <div className="app">
          <Router>
            <Routes>
              <Route path="/nft/:tokenId" element={<NFTPage />} />
              <Route path="/invite/:tokenId" element={<InvitePage />} />
              <Route path="/rebirth/:tokenId" element={<RebirthPage />} />
              <Route path="/" exact element={<App />} />
            </Routes>
          </Router>
        </div>
      </WagmiWrapper>
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
