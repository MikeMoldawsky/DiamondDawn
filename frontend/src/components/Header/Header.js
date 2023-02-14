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
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { isNoContractMode } from "utils";
import { useDispatch, useSelector } from "react-redux";
import Logo from "components/Logo";
import { setSideMenuOpen, toggleMuted, uiSelector } from "store/uiReducer";
import classNames from "classnames";
import CTAButton from "components/CTAButton";
import { TwitterLink, TelegramLink, SubstackLink } from "components/Links";
import useCanAccessDD from "hooks/useCanAccessDD";
import { useDesktopMediaQuery } from "hooks/useMediaQueries";
import TelegramIcon from "@mui/icons-material/Telegram";
import { collectorSelector } from "store/collectorReducer";
import {
  DIAMOND_DAWN_COLLECTORS_TELEGRAM,
  DIAMOND_DAWN_PUBLIC_TELEGRAM,
} from "consts";
import { useAccount } from "wagmi";
import useCollectorReady from "hooks/useCollectorReady";
import { systemSelector } from "store/systemReducer";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isDesktop = useDesktopMediaQuery();
  const { muted, showHPLogo, sideMenuOpen } = useSelector(uiSelector);
  const canAccessDD = useCanAccessDD();
  const collector = useSelector(collectorSelector);
  const collectorReady = useCollectorReady();
  const { maxEntrance, tokensMinted } = useSelector(systemSelector);

  const isHomepage = location.pathname === "/explore";
  const animateShowLogo = isHomepage && showHPLogo;
  const animateHideLogo = isHomepage && showHPLogo === false;

  const onVolumeClick = (e) => {
    e.stopPropagation();
    dispatch(toggleMuted(true));
  };

  const getMenuIcon = () => (sideMenuOpen ? faX : faBars);

  const toggleMenu = () => dispatch(setSideMenuOpen(!sideMenuOpen));

  const showRestrictedContent = canAccessDD && isDesktop;

  return (
    <header onClick={() => sideMenuOpen && toggleMenu()}>
      <div className="bg header-bg" />
      <div className="header-internal">
        {tokensMinted > 0 && (
          <div className="minted-status">
            <VpnKeyIcon /> {tokensMinted} / {maxEntrance} MINTED
          </div>
        )}
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
          {showRestrictedContent && collectorReady && (
            <CTAButton className="md collector-btn" />
          )}
          <div className="center-aligned-row social-links">
            <TwitterLink className="social-link text-gold no-hover">
              <FontAwesomeIcon className="menu-icon" icon={faTwitter} />
            </TwitterLink>
            <SubstackLink className="social-link no-hover">
              <FontAwesomeIcon icon={faBookOpen} />
            </SubstackLink>
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
              onClick={toggleMenu}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
