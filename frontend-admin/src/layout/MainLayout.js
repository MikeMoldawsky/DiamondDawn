import React from "react";
import classNames from "classnames";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from "pages/AdminPage";
import WagmiWrapper from "layout/WagmiWrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainLayout = () => {
  return (
    <div className={classNames("main-layout")}>
      <Router>
        <Routes>
          <Route
            path="/"
            exact
            element={
              <WagmiWrapper>
                <AdminPage />
              </WagmiWrapper>
            }
          />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
