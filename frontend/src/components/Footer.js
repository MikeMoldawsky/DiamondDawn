import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => (
  <footer>
    <div className="footer-inner">
      <div className="center-aligned-row footer-sitemap">
        <NavLink to="/explore">
          <span className="sitemap-link">Homepage</span>
        </NavLink>
        <NavLink to="/the-journey">
          <span className="sitemap-link">The Journey</span>
        </NavLink>
        <NavLink to="/about-us">
          <span className="sitemap-link">About Us</span>
        </NavLink>
        <NavLink to="/technology">
          <span className="sitemap-link">Timeless Technology</span>
        </NavLink>
      </div>
      <div className="center-aligned-row legal-links">
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
