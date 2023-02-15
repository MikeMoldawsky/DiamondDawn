import React from "react";
import "./SocialIcons.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import {
  TwitterLink,
  OpenseaLink,
  SubstackLink,
} from "components/Links";
import openSeaIcon from "assets/images/opensea.svg";
import SVG from "components/SVG";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";

const SocialIcons = () => {
  return (
    <div className="center-center-aligned-row social-icons">
      <TwitterLink className="text-gold no-hover">
        <div className="icon">
          <FontAwesomeIcon icon={faTwitter} />
        </div>
      </TwitterLink>
      <OpenseaLink className="no-hover">
        <SVG src={openSeaIcon} />
      </OpenseaLink>
      <SubstackLink className="no-hover">
        <div className="icon">
          <FontAwesomeIcon icon={faBookOpen} />
        </div>
      </SubstackLink>
    </div>
  );
};

export default SocialIcons;
