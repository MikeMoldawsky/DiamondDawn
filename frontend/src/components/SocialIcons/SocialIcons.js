import React from "react";
import "./SocialIcons.scss";
import TelegramIcon from "@mui/icons-material/Telegram";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { TwitterLink, TelegramLink, OpenseaLink } from "components/Links";
import openSeaIcon from "assets/images/opensea.svg"
import SVG from "components/SVG";

const SocialIcons = () => {
  return (
    <div className="center-center-aligned-row social-icons">
      <TwitterLink className="no-hover">
        <div className="icon">
          <FontAwesomeIcon icon={faTwitter} />
        </div>
      </TwitterLink>
      <TelegramLink className="no-hover">
        <div className="icon">
          <TelegramIcon />
        </div>
      </TelegramLink>
      <OpenseaLink className="no-hover">
        <div className="icon">
          <SVG src={openSeaIcon} className="opensea" />
        </div>
      </OpenseaLink>
    </div>
  );
};

export default SocialIcons;
