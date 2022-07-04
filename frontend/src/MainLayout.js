import React from "react";
import classNames from "classnames";
import 'css/app.scss'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InvitePage from "pages/InvitePage";
import LandingPage from "pages/LandingPage";
import AdminPage from "pages/AdminPage";
import App from "App";

const MainLayout = () => {
  return (
    <div className={classNames("main-layout")}>
      <Router>
        <Routes>
          <Route path="/invite/:token" element={<InvitePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/" exact element={<App />} />
        </Routes>
      </Router>
    </div>
  );
};

export default MainLayout;
