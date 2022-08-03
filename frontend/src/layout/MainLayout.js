import React from "react";
import classNames from "classnames";
import "css/common.scss";
import "pages/App/App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "pages/Homepage";
import InvitePage from "pages/InvitePage";
import ProcessPage from "pages/App/ProcessPage";
import ProcessToken from "pages/App/ProcessToken";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RebirthPage from "pages/RebirthPage";
import NFTPage from "pages/NFTPage";
import AppLayout from "layout/AppLayout";
import useMountLogger from "hooks/useMountLogger";
import WagmiWrapper from "layout/WagmiWrapper";
import ContractProvider from "layout/ContractProvider";

const MainLayout = () => {
  useMountLogger("MainLayout");

  return (
    <div className={classNames("main-layout")}>
      <WagmiWrapper>
        <ContractProvider>
          <Router>
            <AppLayout>
              <Routes>
                <Route path="/" exact element={<Homepage />} />
                <Route path="/">
                  <Route path="nft/:tokenId" element={<NFTPage />} />
                  <Route path="invite/:tokenId" element={<InvitePage />} />
                  <Route path="rebirth/:tokenId" element={<RebirthPage />} />
                  <Route path="process">
                    <Route path="" element={<ProcessPage />} />
                    <Route path=":tokenId" element={<ProcessToken />} />
                  </Route>
                </Route>
              </Routes>
            </AppLayout>
          </Router>
        </ContractProvider>
      </WagmiWrapper>
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
