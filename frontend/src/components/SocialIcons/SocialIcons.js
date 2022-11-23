import React from "react";
import "./SocialIcons.scss";
import TelegramIcon from "@mui/icons-material/Telegram";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { TwitterLink, TelegramLink } from "components/Links";

const SocialIcons = () => {
  return (
    <div className="center-center-aligned-row social-icons">
      <TwitterLink>
        <div className="icon">
          <FontAwesomeIcon icon={faTwitter} />
        </div>
      </TwitterLink>
      <TelegramLink>
        <div className="icon">
          <TelegramIcon />
        </div>
      </TelegramLink>
    </div>
  );
};

export default SocialIcons;
