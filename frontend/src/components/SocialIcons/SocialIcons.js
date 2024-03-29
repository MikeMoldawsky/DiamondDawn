import React from "react";
import "./SocialIcons.scss";
import TelegramIcon from "@mui/icons-material/Telegram";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import Link, {
  TwitterLink,
  TelegramLink,
  OpenseaLink,
  SubstackLink,
} from "components/Links";
import openSeaIcon from "assets/images/opensea.svg";
import SVG from "components/SVG";
import { useSelector } from "react-redux";
import { collectorSelector } from "store/collectorReducer";
import {
  DIAMOND_DAWN_COLLECTORS_TELEGRAM,
  DIAMOND_DAWN_PUBLIC_TELEGRAM,
} from "consts";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";

const SocialIcons = () => {
  const collector = useSelector(collectorSelector);

  return (
    <div className="center-center-aligned-row social-icons">
      <TwitterLink className="no-hover">
        <div className="icon">
          <FontAwesomeIcon icon={faTwitter} />
        </div>
      </TwitterLink>
      {collector?.approved && (
        <TelegramLink
          href={DIAMOND_DAWN_COLLECTORS_TELEGRAM}
          className="no-hover private-tg"
        >
          <div className="icon">
            <TelegramIcon />
          </div>
        </TelegramLink>
      )}
      <TelegramLink href={DIAMOND_DAWN_PUBLIC_TELEGRAM} className="no-hover">
        <div className="icon">
          <TelegramIcon />
        </div>
      </TelegramLink>
      <OpenseaLink className="no-hover">
        <SVG src={openSeaIcon} />
      </OpenseaLink>
      <SubstackLink className="text-gold no-hover">
        <div className="icon">
          <FontAwesomeIcon icon={faBookOpen} />
        </div>
      </SubstackLink>
    </div>
  );
};

export default SocialIcons;
