import React from "react";
import classNames from "classnames";
import 'pages/App/App.scss'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InvitePage from "pages/InvitePage";
import LandingPage from "pages/LandingPage";
import AdminPage from "pages/AdminPage";
import App from "pages/App";
import WagmiWrapper from "layout/WagmiWrapper";

const MainLayout = () => {
  return (
    <div className={classNames("main-layout")}>
      <Router>
        <Routes>
          <Route path="/invite/:token" element={<InvitePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/" exact element={<WagmiWrapper><App /></WagmiWrapper>} />
        </Routes>
      </Router>
    </div>
  );
};

export default MainLayout;
