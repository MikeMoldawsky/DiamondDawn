import React from "react";
import classNames from "classnames";
import "css/common.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "pages/Homepage";
import InvitePage from "pages/InvitePage";
import ProcessPage from "pages/ProcessPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RebirthPage from "pages/RebirthPage";
import NFTPage from "pages/NFTPage";
import AppLoader from "layout/AppLoader";
import useMountLogger from "hooks/useMountLogger";
import WagmiWrapper from "layout/WagmiWrapper";
import ContractProvider from "layout/ContractProvider";
import Header from "components/Header";
import TokensProvider from "layout/TokensProvider";

const MainLayout = () => {
  useMountLogger("MainLayout");

  return (
    <div className={classNames("main-layout")}>
      <WagmiWrapper>
        <Router>
          <Header />
          <Routes>
            <Route path="/" exact element={<Homepage />} />
            <Route path="/">
              <Route
                path="nft/:tokenId"
                element={
                  <TokensProvider withLoader>
                    <NFTPage />
                  </TokensProvider>
                }
              />
              <Route path="invite/:tokenId" element={<InvitePage />} />
              <Route
                path="rebirth/:tokenId"
                element={
                  <TokensProvider withLoader>
                    <RebirthPage />
                  </TokensProvider>
                }
              />
              <Route
                path="process"
                element={
                  <TokensProvider withLoader>
                    <ProcessPage />
                  </TokensProvider>
                }
              />
            </Route>
          </Routes>
          <ContractProvider>
            <AppLoader />
          </ContractProvider>
        </Router>
      </WagmiWrapper>
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
