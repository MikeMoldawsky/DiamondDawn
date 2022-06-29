import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import tweezersLogo from "assets/images/logo.png";
import 'css/app.scss'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import InvitePage from "pages/InvitePage";
import LandingPage from "pages/LandingPage";

const MainLayout = () => {
  return (
    <div className={classNames("main-layout")}>
      <header>
        <div className="logo-box">
          <img src={tweezersLogo} alt="TWEEZERS" />
        </div>
      </header>
      <Router>
        <Routes>
          <Route path="/invite/:token" element={<InvitePage />} />
          <Route path="/" exact element={<LandingPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default MainLayout;
