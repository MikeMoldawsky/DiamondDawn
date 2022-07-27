import React from "react";
import classNames from "classnames";
import 'css/common.scss'
import 'pages/App/App.scss'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "pages/Homepage";
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
      <Router>
        <Routes>
          <Route path="/nft/:tokenId" element={<WagmiWrapper><div className="app"><NFTPage /></div></WagmiWrapper>} />
          <Route path="/invite/:tokenId" element={<WagmiWrapper><div className="app"><InvitePage /></div></WagmiWrapper>} />
          <Route path="/rebirth/:tokenId" element={<WagmiWrapper><div className="app"><RebirthPage /></div></WagmiWrapper>} />
          <Route path="/process" exact element={<WagmiWrapper><div className="app"><App /></div></WagmiWrapper>} />
          <Route path="/" exact element={<Homepage />} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
