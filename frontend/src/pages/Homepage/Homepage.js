import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import animation from "assets/video/infinity_video.mp4";
import ReactPlayer from "react-player";
import './Homepage.scss'
import CommonView from "components/CommonView";
import SVG from "components/SVG";
import scrollMarker from 'assets/images/scroll-marker.svg'
import VideoPlayer from "components/VideoPlayer";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import infinityLogo from 'assets/images/infinity-logo.png'
import blackStone from 'assets/images/black-stone.png'
import PasswordBox from "components/PasswordBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

const Homepage = () => {
  return (
    <div className={classNames("page homepage")} >
      <div className="bg" />
      <div className="box box-top">
        <CommonView leadingText="A BILLION YEARS IN THE MAKING"
                    secondaryText="the first ever diamond mining experience, from NFT to reality">
          <img src={infinityLogo} alt={''} />
        </CommonView>
        <a href="#video">
          <SVG src={scrollMarker} className="scroll-marker" />
        </a>
      </div>
      <div id="video" className="box center-aligned-column box-middle">
        <VideoPlayer noVideo>
          <OndemandVideoIcon />
          <div>TEASER VIDEO</div>
        </VideoPlayer>
      </div>
      <div className="box center-aligned-column box-bottom">
        <div className="bg" />
        <CommonView leadingText={["EVERY BIRTH OF A DIAMOND IS A MIRACLE OF NATURE,", "BEGINNING ONLY AS A MERE POTENTIAL"]}
                    secondaryText="Do you have what it takes to shine?">
          <img src={blackStone} alt="Diamond" />
        </CommonView>
        <PasswordBox />
        <div className="center-aligned-column join-us">
          <div>join us on this unequaled experience</div>
          <div className="button inverted icon-after">
            Stay updated on Twitter <FontAwesomeIcon icon={faTwitter} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
