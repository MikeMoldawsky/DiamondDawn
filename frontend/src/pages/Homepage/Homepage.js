import React, {useEffect, useCallback, useMemo} from "react";
import "./Homepage.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {setSelectedTokenId, uiSelector, updateUiState} from "store/uiReducer";
import { getCDNVideoUrl, isDemoAndAuthSelector } from "utils";
import HomeBackground from "components/HomeBackground";
import Countdown from "components/Countdown";
import ReactPlayer from "react-player";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import Footer from "components/Footer";
import ScrollingPage from "components/ScrollingPage";
import EternalTreasuresBackground from "components/EternalTreasuresBackground";
import AnimatedLogo from "components/AnimatedLogo";
import useWindowDimensions from "hooks/useWindowDimensions";
import roughStone from "assets/videos/rough-stone.webm";
import classNames from "classnames";
import {EternalTreasuresText, ScarcityText, TeaserText, ValueText} from "pages/Homepage/HompageContent";

const Homepage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isRestricted = useSelector(isDemoAndAuthSelector(false));
  const { scroll } = useSelector(uiSelector)
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    return () => {
      dispatch(updateUiState({ scroll: 0 }))
    }
  }, [])

  useEffect(() => {
    isRestricted && navigate("/");
    dispatch(setSelectedTokenId(-1));
  }, []);

  const renderTeaserBg = useCallback(
    () => (
      <ReactPlayer
        url={getCDNVideoUrl("teaser-short.mp4")}
        playing
        playsinline
        controls={false}
        className="react-player"
        muted
        loop
        width=""
        height=""
      />
    ),
    []
  );

  const winHeightLimit = height / 2

  const topViewEffectScrollLimit = scroll < winHeightLimit ? scroll : winHeightLimit

  const topViewStyles = useMemo(() => {
    return {
      opacity: 1 - (scroll * 1.5 / winHeightLimit),
      transform: `scale(${1 - (scroll / winHeightLimit / 1.5)})`,
    }
  }, [topViewEffectScrollLimit])

  const stoneStyles = useMemo(() => {
    if (width > 1500 && width > 1024) return {}
    let ref
    if (width > 1200) {
      ref = 65 + 275 * (width - 1200) / (1500 - 1200)
    }
    else {
      ref = 10 + 165 * (width - 1024) / (1200 - 1024)
    }
    return {
      left: `${ref}px`,
    }
  }, [width])

  return (
    <ScrollingPage className="homepage">
      <div className="top-content center-aligned-column">
        <HomeBackground />
        <div className="common-view" style={topViewStyles}>
          <AnimatedLogo withText />
          <div className="secondary-text">
            The first ever virtual diamond mining experience
          </div>
          <div className="countdown-container">
            <div className="text">Mine will open in</div>
            <Countdown
              parts={{ days: 24, hours: 3, minutes: 0, seconds: 0 }}
              smallParts={{ minutes: true, seconds: true }}
              smallMinAndSec
            />
          </div>
          <div>
            <div
              className="button transparent disabled"
              title="Mine open date will be announced soon!"
            >
              ENTER MINE
            </div>
          </div>
        </div>
      </div>
      <div className="info-section">
        <EternalTreasuresBackground />
        <div className="eternal-treasures">
          <div className="et-bg">
            <div className="bg statue" />
            <ReactPlayer
              url={roughStone}
              playing
              playsinline
              controls={false}
              muted
              loop
              className={classNames("react-player bg-element rough-diamond")}
              width=""
              height=""
              style={stoneStyles}
            />
          </div>
          <div className="text-section">
            <EternalTreasuresText />
          </div>
        </div>
        <div className="scarcity">
          <div className="text-section">
            <ScarcityText />
          </div>
        </div>
        <div className="value-section">
          <div className="text-section">
            <ValueText />
          </div>
        </div>
      </div>

      <div className="teaser">
        {renderTeaserBg()}
        <div className="center-aligned-column content">
          <TeaserText />
          {/*<PlayCircleOutlineIcon />*/}
          {/*<div>PLAY FULL TRAILER</div>*/}
          <div className="button transparent">REQUEST AN INVITATION</div>
        </div>
      </div>
      <Footer />
    </ScrollingPage>
  );
};

export default Homepage;
