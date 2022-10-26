import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import "./Homepage.scss";
import CommonView from "components/CommonView";
import VideoPlayer from "components/VideoPlayer";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";
import { SYSTEM_STAGE, SYSTEM_STAGE_NAME } from "consts";
import { setSelectedTokenId, uiSelector } from "store/uiReducer";
import { tokensSelector } from "store/tokensReducer";
import size from "lodash/size";
import {getCDNObjectUrl, isDemo, isDemoAndAuthSelector} from "utils";
import HomeBackground from "components/HomeBackground";
import Countdown from "components/Countdown";

const EnterButton = () => {
  const { systemStage, isActive } = useSelector(systemSelector);
  const tokens = useSelector(tokensSelector);
  const visible = systemStage >= SYSTEM_STAGE.MINE && isActive;
  const disabled = size(tokens) === 0;
  return visible ? (
    <NavLink to={`/process`}>
      <div
        className={classNames("button text-upper", { disabled })}
        style={{ marginTop: 40 }}
      >
        ENTER {SYSTEM_STAGE_NAME[systemStage]}
      </div>
    </NavLink>
  ) : null;
};

const Homepage = () => {
  const videoPlayer = useRef(null);
  const [playVideo, setPlayVideo] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isRestricted = useSelector(isDemoAndAuthSelector(false))

  useEffect(() => {
    isRestricted && navigate("/");
    dispatch(setSelectedTokenId(-1));
  }, []);

  const handleScroll = (event) => {
    // if (playVideo) return;
    //
    // const video = videoPlayer.current;
    // const scrollTop = event.currentTarget.scrollTop;
    // const videoTop = video.offsetTop + video.offsetParent.offsetTop;
    // const startPlayAt = videoTop - video.offsetHeight / 3;
    //
    // if (scrollTop > startPlayAt) {
    //   setPlayVideo(true);
    // }
  };

  return (
    <div className="page homepage" onScroll={handleScroll}>
      <div className="top-content center-aligned-column">
        <HomeBackground />
        <div className="common-view">
          <img src={getCDNObjectUrl("/images/infinity_logo.png")} alt="" />
          <div className="secondary-text">
            For the first time in history,
            <br />a gemological symbiosis of the virtual and the physical
          </div>
          <div className="countdown">
            <Countdown
              renderParts={{ weeks: false }}
              parts={{ days: 3, hours: 3, minutes: 3, seconds: 0 }}
            />
          </div>
        </div>
      </div>
      <div className="eternal-treasures">
        <div className="bg-stars" />
        <div className="grid">
          <div className="space-cell" />
          <div className="title-cell">
            <div className="leading-text">ETERNAL TREASURES</div>
          </div>
          <div className="text1-cell">
            <p className="text">
              Deep below the earth’s surface, under immense pressure and
              scorching heat over billions of years, a marvel of nature is
              formed. A diamond.
            </p>
            <p className="text">
              For thousands of years, they have been the ultimate symbol of
              wealth and abundance, worshiped and fought over by emperors for
              their sparkle and beauty. The strongest, most enduring material on
              Earth, a single diamond, smaller than a pea, can cost tens of
              millions of dollars for its clarity and color.
            </p>
            <p className="text">
              <b>But are diamonds REALLY that rare?</b>
            </p>
          </div>
          <div className="text2-cell">
            <p className="text">
              The recent rise of lab-grown diamonds makes it impossible for
              anyone to distinguish a ‘real’ diamond from a man-made one without
              special equipment. Not only that, but it’s largely unknown that
              big diamond companies keep vast quantities of diamonds hidden away
              in huge vaults, controlling the circulation and supply of the
              diamond market. The less diamonds we think are the more ‘rare’
              they appear to be.
            </p>
            <p className="text">
              <b>
                So, if the supply of diamonds is unknown, and we can now produce
                them ourselves, How can we evaluate the actual worth of a
                physical diamond?
              </b>
            </p>
          </div>
        </div>
      </div>
      {/*<div className="bg-stars" />*/}
      {/*<div className="bg" />*/}
      {/*<div className="box box-top">*/}
      {/*  <CommonView*/}
      {/*    leadingText="A BILLION YEARS IN THE MAKING"*/}
      {/*    secondaryText="the first ever diamond mining experience, from NFT to reality"*/}
      {/*  >*/}
      {/*    <img src={getCDNObjectUrl("/images/infinity_logo.png")} alt="" />*/}
      {/*  </CommonView>*/}
      {/*  <EnterButton />*/}
      {/*</div>*/}
      {/*<div id="video" className="box center-aligned-column box-middle">*/}
      {/*  <VideoPlayer*/}
      {/*    id="home-video"*/}
      {/*    videoPlayer={videoPlayer}*/}
      {/*    src={getCDNObjectUrl("/videos/teaser.mp4")}*/}
      {/*    controls*/}
      {/*    playing={playVideo}*/}
      {/*  />*/}
      {/*</div>*/}
    </div>
  );
};

export default Homepage;
