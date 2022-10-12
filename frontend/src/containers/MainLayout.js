import React, { useEffect, useState } from "react";
import classNames from "classnames";
import "css/common.scss";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
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
import TeamPage from "pages/TeamPage";
import FAQPage from "pages/FAQPage";
import Header from "components/Header";
import SideMenu from "components/SideMenu";
import CollectorPage from "pages/CollectorPage";
import useActionDispatch from "hooks/useActionDispatch";
import { loadContractInfo } from "store/systemReducer";
import AccountProvider from "containers/AccountProvider";
import ComingSoonPage from "pages/ComingSoonPage";
import {useSelector} from "react-redux";
import {uiSelector} from "store/uiReducer";
import {isDemo} from "utils";

const MainLayout = () => {
  useMountLogger("MainLayout");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const actionDispatch = useActionDispatch();
  const { demoAuth } = useSelector(uiSelector)

  useEffect(() => {
    actionDispatch(loadContractInfo(), "get-contract");
  }, []);

  const isDemoMode = isDemo()

  return (
    <div className={classNames("main-layout", { "drawer-open": drawerOpen })}>
      <WagmiWrapper>
        <Router>
          <Header
            isMenuOpen={drawerOpen}
            toggleMenu={() => setDrawerOpen(!drawerOpen)}
          />
          <Routes>
            <Route path="/" exact element={isDemoMode && !demoAuth ? <ComingSoonPage /> : <Homepage />} />
            <Route path="/">
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
              <Route path="collector" element={<CollectorPage />} />
              <Route
                path="nft/:tokenId"
                element={
                  <TokensProvider withLoader isGated>
                    <NFTPage />
                  </TokensProvider>
                }
              />
              <Route path="team" element={<TeamPage />} />
              <Route path="faq" element={<FAQPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
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
