import React, { useEffect } from "react";
import classNames from "classnames";
import "css/common.scss";
import "css/elements.scss";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router } from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
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
import { useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import {isBlockedCountry} from "utils";

const App = () => {
  const { sideMenuOpen, geoLocation } = useSelector(uiSelector);
  const actionDispatch = useActionDispatch();

  useEffect(() => {
    actionDispatch(loadContractInfo(), "get-contract");
  }, []);

  useEffect(() => {
    if (geoLocation?.country_code && isBlockedCountry(geoLocation.country_code)) {
      toast.error("Diamond Dawn is not operational in your country", {
        position: "bottom-center",
        autoClose: false,
        draggable: false,
        theme: "dark",
      });
    }
  }, [geoLocation?.country_code])

  return (
    <div className={classNames("main-layout", { "drawer-open": sideMenuOpen })}>
      <WagmiWrapper>
        <NetworkGuard>
          <Router>
            <ScrollToTop />
            <Header />
            <AppRoutes />
            <SideMenu />
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
