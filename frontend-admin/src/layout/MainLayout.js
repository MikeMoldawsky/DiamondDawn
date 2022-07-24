import React from "react";
import classNames from "classnames";
import 'pages/App/App.scss'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "pages/LandingPage";
import AdminPage from "pages/AdminPage";
import WagmiWrapper from "layout/WagmiWrapper";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RebirthPage from "pages/RebirthPage";

const MainLayout = () => {
  return (
    <div className={classNames("main-layout")}>
      <Router>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/rebirth/:token" element={<WagmiWrapper><RebirthPage /></WagmiWrapper>} />
          <Route path="/" exact element={<WagmiWrapper><AdminPage /></WagmiWrapper>} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
