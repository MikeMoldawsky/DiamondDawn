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
import { usePageSizeLimit } from "components/PageSizeLimit/PageSizeLimit";
import CTAButton from "components/CTAButton";
import { TwitterLink } from "components/Links";
import usePermission from "hooks/usePermission";

const Header = ({ isMenuOpen, toggleMenu }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isDesktop = usePageSizeLimit();
  const { muted, showHPLogo } = useSelector(uiSelector);
  const canAccessDD = usePermission();

  const isHomepage = location.pathname === "/explore";
  const animateShowLogo = isHomepage && showHPLogo;
  const animateHideLogo = isHomepage && showHPLogo === false;

  const onVolumeClick = (e) => {
    e.stopPropagation();
    dispatch(toggleMuted(true));
  };

  const getMenuIcon = () => (isMenuOpen ? faX : faBars);

  const onMenuIconClick = () => {
    toggleMenu();
  };

  const showRestrictedContent = canAccessDD && isDesktop;

  return (
    <header onClick={() => isMenuOpen && toggleMenu()}>
      <div className="header-internal">
        <div className="center-aligned-row header-side">
          <div className="wallet">
            <Wallet />
          </div>
          {!isNoContractMode() && isDesktop && (
            <ContractProvider>
              <DiamondList />
            </ContractProvider>
          )}
        </div>
        <Logo
          withLink
          withText
          className={classNames({
            hidden: isHomepage,
            "animate-show": animateShowLogo,
            "animate-hide": animateHideLogo,
          })}
        />
        <div className="center-aligned-row header-side">
          {showRestrictedContent && <CTAButton className="md collector-btn" />}
          <TwitterLink className="no-hover">
            <FontAwesomeIcon className="menu-icon" icon={faTwitter} />
          </TwitterLink>
          <div className="vertical-sep" />
          <FontAwesomeIcon
            className="menu-icon mute-icon"
            icon={muted ? faVolumeMute : faVolumeUp}
            onClick={onVolumeClick}
          />
          {canAccessDD && (
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
