import React from "react";
import "./Header.scss";
import { NavLink, useLocation } from "react-router-dom";
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
import AudioPlayer from "components/AudioPlayer";
import { isDemoAndAuthSelector } from "utils";
import { DIAMOND_DAWN_TWITTER_URL } from "consts";
import { useDispatch, useSelector } from "react-redux";
import Logo from "components/Logo";
import { toggleMuted, uiSelector } from "store/uiReducer";
import classNames from "classnames";
import { usePageSizeLimit } from "components/PageSizeLimit";

const Header = ({ isMenuOpen, toggleMenu }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isRestricted = useSelector(isDemoAndAuthSelector(false));
  const isPageSizeLimitOk = usePageSizeLimit();
  const { muted, showHPLogo } = useSelector(uiSelector);

  const isHomepage =
    location.pathname === "/" || location.pathname === "/explore";
  const animateShowLogo = isHomepage && showHPLogo;
  const animateHideLogo = isHomepage && showHPLogo === false;

  return (
    <>
      <div className="header-fix" />
      <header>
        <div className="header-internal">
          <div className="center-aligned-row header-side">
            {!isRestricted && isPageSizeLimitOk && (
              <>
                <div className="wallet">
                  <Wallet />
                </div>
                <ContractProvider>
                  <DiamondList />
                </ContractProvider>
              </>
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
            {!isRestricted && isPageSizeLimitOk && (
              <NavLink to="/collector">
                <div className="link">APPLY FOR DIAMOND DAWN</div>
              </NavLink>
            )}
            <a target="_blank" rel="noreferrer" href={DIAMOND_DAWN_TWITTER_URL}>
              <FontAwesomeIcon className="menu-icon" icon={faTwitter} />
            </a>
            <div className="vertical-sep" />
            <FontAwesomeIcon
              className="menu-icon mute-icon"
              icon={muted ? faVolumeMute : faVolumeUp}
              onClick={() => dispatch(toggleMuted())}
            />
            <AudioPlayer />
            {!isRestricted && isPageSizeLimitOk && (
              <FontAwesomeIcon
                className="menu-icon"
                icon={isMenuOpen ? faX : faBars}
                onClick={toggleMenu}
              />
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
