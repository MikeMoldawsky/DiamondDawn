import React from "react";
import classNames from "classnames";
import 'css/common.scss'
import 'pages/App/App.scss'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "pages/Homepage";
import InvitePage from "pages/InvitePage";
import ProcessPage from "pages/App/ProcessPage";
import ProcessToken from "pages/App/ProcessToken";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RebirthPage from "pages/RebirthPage";
import NFTPage from "pages/NFTPage";
import AppLayout from "layout/AppLayout";

const MainLayout = () => {
  return (
    <div className={classNames("main-layout")}>
      <Router>
        <Routes>
          <Route path="/" exact element={<Homepage />} />
          <Route path="/">
            <Route path="nft/:tokenId" element={<AppLayout showTimeline><NFTPage /></AppLayout>} />
            <Route path="invite/:tokenId" element={<AppLayout><InvitePage /></AppLayout>} />
            <Route path="rebirth/:tokenId" element={<AppLayout><RebirthPage /></AppLayout>} />
            <Route path="process">
              <Route path="" element={<AppLayout showTimeline><ProcessPage /></AppLayout>} />
              <Route path=":tokenId" element={<AppLayout showTimeline><ProcessToken /></AppLayout>} />
            </Route>
          </Route>
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
