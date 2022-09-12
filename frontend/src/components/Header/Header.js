import React from "react";
import ddLogo from "assets/images/dd-logo.png";
import "./Header.scss";
import { NavLink, useLocation } from "react-router-dom";
import DiamondList from "components/DiamondList";
import Wallet from "components/Wallet";
import ContractProvider from "containers/ContractProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import AudioPlayer from "components/AudioPlayer";

const Header = ({ isMenuOpen, toggleMenu }) => {
  const location = useLocation();
  const isLogoVisible = location.pathname !== "/";

  return (
    <header>
      <div className="header-internal">
        <div className="center-aligned-row header-side">
          <Wallet />
          <ContractProvider>
            <DiamondList />
          </ContractProvider>
        </div>
        {isLogoVisible && (
          <div className="logo-box">
            <NavLink to="/">
              <img src={ddLogo} alt="TWEEZERS" />
            </NavLink>
          </div>
        )}
        <div className="center-aligned-row header-side">
          <FontAwesomeIcon className="menu-icon" icon={faTwitter} />
          <div className="vertical-sep" />
          <AudioPlayer />
          <FontAwesomeIcon
            className="menu-icon"
            icon={isMenuOpen ? faX : faBars}
            onClick={toggleMenu}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
