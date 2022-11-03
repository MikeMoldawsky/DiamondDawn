import React from "react";
import { NavLink } from "react-router-dom";
import { getCDNImageUrl } from "utils";
import classNames from "classnames";

const Logo = ({ className, withText, withLink }) => {
  const renderImage = () => (
    <img src={getCDNImageUrl("infinity_logo.png")} alt="DIAMOND DAWN" />
  );
  return (
    <div
      className={classNames("logo-box", { "with-text": withText }, className)}
    >
      {withLink ? <NavLink to="/">{renderImage()}</NavLink> : renderImage()}
    </div>
  );
};

export default Logo;
