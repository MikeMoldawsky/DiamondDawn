import React, { useState } from "react";
import "./Footer.scss";
import { NavLink } from "react-router-dom";
import Logo from "components/Logo";
import SocialIcons from "components/SocialIcons";
import SVG from "components/SVG";
import star from "assets/images/star.svg";
import FAQs from "components/FAQs";
import classNames from "classnames";

const Footer = ({ withFAQs }) => {
  return (
    <footer
      className={classNames("footer", {
        "with-faqs": withFAQs,
      })}
    >
      <div className="bg bg-footer" />
      {withFAQs && (
        <div className="faq-section">
          <div className="subtitle-text">FAQs</div>
          <FAQs collapsed />
        </div>
      )}
      <div className="stretch-center-aligned-row footer-inner">
        <div className="center-spaced-column">
          <Logo withText />
          <SocialIcons />
        </div>
        <div className="separator" />
        <div className="left-bottom-aligned-column footer-menu">
          <div className="left-center-aligned-row top-menu">
            <NavLink to="/explore">
              <span className="sitemap-link">Homepage</span>
            </NavLink>
            <SVG src={star} />
            <NavLink to="/the-journey">
              <span className="sitemap-link">The Journey</span>
            </NavLink>
            <SVG src={star} />
            <NavLink to="/about-us">
              <span className="sitemap-link">About Us</span>
            </NavLink>
            <SVG src={star} />
            <NavLink to="/technology">
              <span className="sitemap-link">Timeless Technology</span>
            </NavLink>
            <SVG src={star} />
            <NavLink to="/faq">
              <span className="sitemap-link">FAQs</span>
            </NavLink>
            <SVG className="last-star" src={star} />
          </div>
          <div className="left-center-aligned-row bottom-menu">
            <NavLink to="/privacy" className="inverted">
              <span className="link">Privacy Policy</span>
            </NavLink>
            <NavLink to="/tnc" className="inverted">
              <span className="link">Terms & Conditions</span>
            </NavLink>
            <NavLink to="/credits" className="inverted">
              <span className="link">Credits</span>
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
