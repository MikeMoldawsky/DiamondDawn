import React from "react";
import classNames from "classnames";
import 'css/common.scss'
import 'pages/App/App.scss'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "pages/Homepage";
import InvitePage from "pages/InvitePage";
import LandingPage from "pages/LandingPage";
import AdminPage from "pages/AdminPage";
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
          <Route path="/admin" element={<WagmiWrapper><AdminPage /></WagmiWrapper>} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/rebirth/:token" element={<WagmiWrapper><RebirthPage /></WagmiWrapper>} />
          <Route path="/app" exact element={<WagmiWrapper><App /></WagmiWrapper>} />
          <Route path="/" exact element={<Homepage />} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
