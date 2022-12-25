import React, { useEffect, useState } from "react";
import classNames from "classnames";
import "css/common.scss";
import "css/elements.scss";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import WagmiWrapper from "containers/WagmiWrapper";
import AppLoader from "containers/AppLoader";
import AppRoutes from "pages";
import Header from "components/Header";
import SideMenu from "components/SideMenu";
import useActionDispatch from "hooks/useActionDispatch";
import { loadContractInfo } from "store/systemReducer";
import ScrollToTop from "components/ScrollToTop";
import AudioPlayer from "components/AudioPlayer";
import VideoPlayer from "components/VideoPlayer";
import NetworkGuard from "containers/NetworkGuard";
import CopyNotification from "components/CopyNotification";

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const actionDispatch = useActionDispatch();

  useEffect(() => {
    actionDispatch(loadContractInfo(), "get-contract");
  }, []);

  return (
    <div className={classNames("main-layout", { "drawer-open": drawerOpen })}>
      <WagmiWrapper>
        <NetworkGuard>
          <Router>
            <ScrollToTop />
            <Header
              isMenuOpen={drawerOpen}
              toggleMenu={() => setDrawerOpen(!drawerOpen)}
            />
            <AppRoutes />
            <SideMenu
              isOpen={drawerOpen}
              closeMenu={() => setDrawerOpen(false)}
            />
            <AppLoader />
            <AudioPlayer />
            <VideoPlayer />
          </Router>
        </NetworkGuard>
      </WagmiWrapper>
      <ToastContainer />
      <CopyNotification />
    </div>
  );
};

export default App;
