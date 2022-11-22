import React from "react";
import "./Header.scss";
import { useLocation } from "react-router-dom";
import DiamondList from "components/DiamondList";
import Wallet from "components/Wallet";
import ContractProvider from "containers/ContractProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faVolumeMute,
  faVolumeUp,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { isNoContractMode } from "utils";
import { useDispatch, useSelector } from "react-redux";
import Logo from "components/Logo";
import { toggleMuted, uiSelector } from "store/uiReducer";
import classNames from "classnames";
import { usePageSizeLimit } from "components/PageSizeLimit";
import { canAccessDDSelector } from "store/selectors";
import { isActionFirstCompleteSelector } from "store/actionStatusReducer";
import CTAButton from "components/CTAButton";
import { TwitterLink } from "components/Links";
import {clearVideoState, updateVideoState, videoSelector} from "store/videoReducer";

const Header = ({ isMenuOpen, toggleMenu }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const canAccessDD = useSelector(canAccessDDSelector);
  const isPageSizeLimitOk = usePageSizeLimit();
  const { muted, showHPLogo } = useSelector(uiSelector);
  const { isOpen: isVideoOpen } = useSelector(videoSelector)
  const isCollectorFetched = useSelector(
    isActionFirstCompleteSelector("get-collector-by-address")
  );
  const isHomepage =
    location.pathname === "/" || location.pathname === "/explore";
  const animateShowLogo = isHomepage && showHPLogo;
  const animateHideLogo = isHomepage && showHPLogo === false;

  const onVolumeClick = (e) => {
    e.stopPropagation();
    dispatch(toggleMuted(true));
  };

  const getMenuIcon = () => isMenuOpen || isVideoOpen ? faX : faBars

  const onMenuIconClick = () => {
    if (isVideoOpen) {
      return dispatch(clearVideoState())
    }
    toggleMenu()
  }

  return (
    <header onClick={() => isMenuOpen && toggleMenu()}>
      <div className="header-internal">
        <div className="center-aligned-row header-side">
          {isPageSizeLimitOk && (
            <div className="wallet">
              <Wallet />
            </div>
          )}
          {!isNoContractMode() && isPageSizeLimitOk && (
            <ContractProvider>
              <DiamondList />
            </ContractProvider>
          )}
        </div>
        <Logo
          withLink
          withText
          className={classNames({
            hidden: isHomepage || !isPageSizeLimitOk,
            "animate-show": animateShowLogo,
            "animate-hide": animateHideLogo,
          })}
        />
        <div className="center-aligned-row header-side">
          {isPageSizeLimitOk && canAccessDD && (
            <CTAButton className="sm collector-btn" />
          )}
          <TwitterLink>
            <FontAwesomeIcon className="menu-icon" icon={faTwitter} />
          </TwitterLink>
          <div className="vertical-sep" />
          <FontAwesomeIcon
            className="menu-icon mute-icon"
            icon={muted ? faVolumeMute : faVolumeUp}
            onClick={onVolumeClick}
          />
          {isCollectorFetched && canAccessDD && isPageSizeLimitOk && (
            <FontAwesomeIcon
              className="menu-icon"
              icon={getMenuIcon()}
              onClick={onMenuIconClick}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
