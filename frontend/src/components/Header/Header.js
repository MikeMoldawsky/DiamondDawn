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
import CTAButton from "components/CTAButton";
import { TwitterLink, TelegramLink } from "components/Links";
import usePermission from "hooks/usePermission";
import { useDesktopMediaQuery } from "hooks/useMediaQueries";
import TelegramIcon from "@mui/icons-material/Telegram";
import { collectorSelector } from "store/collectorReducer";

const Header = ({ isMenuOpen, toggleMenu }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isDesktop = useDesktopMediaQuery();
  const { muted, showHPLogo } = useSelector(uiSelector);
  const canAccessDD = usePermission();
  const collector = useSelector(collectorSelector);

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
          <Wallet />
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
          <div className="center-aligned-row social-links">
            <TwitterLink className="social-link no-hover">
              <FontAwesomeIcon className="menu-icon" icon={faTwitter} />
            </TwitterLink>
            {collector?.approved && (
              <TelegramLink className="social-link no-hover private-tg">
                <TelegramIcon />
              </TelegramLink>
            )}
            <TelegramLink className="social-link no-hover">
              <TelegramIcon />
            </TelegramLink>
          </div>
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
