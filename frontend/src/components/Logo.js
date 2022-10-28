import React from "react";
import { NavLink } from "react-router-dom";
import { getCDNObjectUrl } from "utils";
import classNames from "classnames";

const Logo = ({ withText, withLink }) => {
  const renderImage = () => (
    <img
      src={getCDNObjectUrl("/images/infinity_logo.png")}
      alt="DIAMOND DAWN"
    />
  );
  return (
    <div className={classNames("logo-box", { "with-text": withText })}>
      {withLink ? <NavLink to="/">{renderImage()}</NavLink> : renderImage()}
    </div>
  );
};

export default Logo;
