import React from "react";
import classNames from "classnames";
import 'pages/App/App.scss'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from "pages/AdminPage";
import WagmiWrapper from "layout/WagmiWrapper";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLayout = () => {
  return (
    <div className={classNames("main-layout")}>
      <Router>
        <Routes>
          <Route path="/" element={<WagmiWrapper><AdminPage /></WagmiWrapper>} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
};

export default AdminLayout;
