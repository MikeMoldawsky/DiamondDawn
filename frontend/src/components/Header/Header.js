import React from "react";
import "./Header.scss";
import { NavLink, useLocation } from "react-router-dom";
import DiamondList from "components/DiamondList";
import Wallet from "components/Wallet";
import ContractProvider from "containers/ContractProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import AudioPlayer from "components/AudioPlayer";
import {getCDNObjectUrl, isDemo, isDemoAndAuthSelector} from "utils";
import { DIAMOND_DAWN_TWITTER_URL } from "consts";
import {useSelector} from "react-redux";
import Logo from "components/Logo";

const Header = ({ isMenuOpen, toggleMenu }) => {
  const location = useLocation();
  const isRestricted = useSelector(isDemoAndAuthSelector(false))
  console.log({ location, isRestricted })
  const showLogo = location.pathname !== "/explore" && (location.pathname !== "/" || isRestricted);

  return (
    <header>
      <div className="header-internal">
        <div className="center-aligned-row header-side">
          {!isRestricted && (
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
        {showLogo && <Logo withLink withText />}
        <div className="center-aligned-row header-side">
          <a target="_blank" rel="noreferrer" href={DIAMOND_DAWN_TWITTER_URL}>
            <FontAwesomeIcon className="menu-icon" icon={faTwitter} />
          </a>
          {/*{!isDemo() && (*/}
          <>
            <div className="vertical-sep" />
            <AudioPlayer />
            {!isRestricted && (
              <FontAwesomeIcon
                className="menu-icon"
                icon={isMenuOpen ? faX : faBars}
                onClick={toggleMenu}
              />
            )}
          </>
          {/*)}*/}
        </div>
      </div>
    </header>
  );
};

export default Header;
