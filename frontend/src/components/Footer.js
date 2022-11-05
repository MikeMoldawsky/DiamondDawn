import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => (
  <footer>
    <div className="footer-inner">
      <div className="center-aligned-row">
        <NavLink to="/privacy">
          <span className="link">Privacy Policy</span>
        </NavLink>
        <NavLink to="/tnc">
          <span className="link">Terms & Conditions</span>
        </NavLink>
      </div>
    </div>
  </footer>
);

export default Footer;
