import React, { useState } from "react";
import classNames from "classnames";
import "css/common.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useMountLogger from "hooks/useMountLogger";
import WagmiWrapper from "containers/WagmiWrapper";
import ContractProvider from "containers/ContractProvider";
import TokensProvider from "containers/TokensProvider";
import AppLoader from "containers/AppLoader";
import Homepage from "pages/Homepage";
import ProcessPage from "pages/ProcessPage";
import NFTPage from "pages/NFTPage";
import RebirthPage from "pages/RebirthPage";
import InvitePage from "pages/InvitePage";
import TeamPage from "pages/TeamPage";
import FAQPage from "pages/FAQPage";
import Header from "components/Header";
import SideMenu from "components/SideMenu";

const MainLayout = () => {
  useMountLogger("MainLayout");

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={classNames("main-layout", { "drawer-open": drawerOpen })}>
      <WagmiWrapper>
        <Router>
          <Header
            isMenuOpen={drawerOpen}
            toggleMenu={() => setDrawerOpen(!drawerOpen)}
          />
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
              <Route
                path="invite/:inviteId"
                element={
                  <TokensProvider withLoader>
                    <InvitePage />
                  </TokensProvider>
                }
              />
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
              <Route path="team" element={<TeamPage />} />
              <Route path="faq" element={<FAQPage />} />
            </Route>
          </Routes>
          <SideMenu
            isOpen={drawerOpen}
            closeMenu={() => setDrawerOpen(false)}
          />
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
