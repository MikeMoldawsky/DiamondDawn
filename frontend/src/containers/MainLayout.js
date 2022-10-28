import React, { useEffect, useState } from "react";
import classNames from "classnames";
import "css/common.scss";
import "css/elements.scss";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import AboutPage from "pages/AboutPage";
import Header from "components/Header";
import SideMenu from "components/SideMenu";
import CollectorPage from "pages/CollectorPage";
import useActionDispatch from "hooks/useActionDispatch";
import { loadContractInfo } from "store/systemReducer";
import AccountProvider from "containers/AccountProvider";
import ComingSoonPage from "pages/ComingSoonPage";
import { useSelector } from "react-redux";
import { isDemo, isDemoAndAuthSelector } from "utils";

const MainLayout = () => {
  useMountLogger("MainLayout");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const actionDispatch = useActionDispatch();
  const isRestricted = useSelector(isDemoAndAuthSelector(false));

  useEffect(() => {
    actionDispatch(loadContractInfo(), "get-contract");
  }, []);

  const isDemoMode = isDemo();

  return (
    <div className={classNames("main-layout", { "drawer-open": drawerOpen })}>
      <WagmiWrapper>
        <Router>
          <Header
            isMenuOpen={drawerOpen}
            toggleMenu={() => setDrawerOpen(!drawerOpen)}
          />
          <Routes>
            <Route
              path="/"
              exact
              element={
                // <Homepage />
                isRestricted ? <ComingSoonPage /> : <Homepage />
              }
            />
            {!isRestricted && (
              <>
                <Route path="/explore" element={<Homepage />} />
                <Route
                  path="invite/:inviteId"
                  element={
                    <AccountProvider withLoader>
                      <InvitePage />
                    </AccountProvider>
                  }
                />
                <Route
                  path="process"
                  element={
                    <TokensProvider withLoader isGated>
                      <ProcessPage />
                    </TokensProvider>
                  }
                />
                <Route
                  path="rebirth/:tokenId"
                  element={
                    <TokensProvider withLoader isGated>
                      <RebirthPage />
                    </TokensProvider>
                  }
                />
                <Route
                  path="collector"
                  element={
                    <TokensProvider goThrough>
                      <CollectorPage />
                    </TokensProvider>
                  }
                />
                <Route
                  path="nft/:tokenId"
                  element={
                    <TokensProvider withLoader isGated>
                      <NFTPage />
                    </TokensProvider>
                  }
                />
                <Route path="about" element={<AboutPage />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <SideMenu
            isOpen={drawerOpen}
            closeMenu={() => setDrawerOpen(false)}
          />
          {!isDemoMode && (
            <ContractProvider>
              <AppLoader />
            </ContractProvider>
          )}
        </Router>
      </WagmiWrapper>
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
