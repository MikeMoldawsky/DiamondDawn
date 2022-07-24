import React from "react";
import classNames from "classnames";
import 'pages/App/App.scss'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InvitePage from "pages/InvitePage";
import LandingPage from "pages/LandingPage";
import App from "pages/App";
import WagmiWrapper from "layout/WagmiWrapper";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RebirthPage from "pages/RebirthPage";

const MainLayout = () => {
  return (
    <div className={classNames("main-layout")}>
      <Router>
        <Routes>
          <Route path="/invite/:token" element={<InvitePage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/rebirth/:token" element={<WagmiWrapper><RebirthPage /></WagmiWrapper>} />
          <Route path="/" exact element={<WagmiWrapper><App /></WagmiWrapper>} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
