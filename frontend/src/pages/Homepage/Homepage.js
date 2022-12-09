import React, { useEffect, useMemo, useState } from "react";
import "./Homepage.scss";
import { useDispatch } from "react-redux";
import { setSelectedTokenId } from "store/uiReducer";
import { getCDNImageUrl } from "utils";
import HomeBackground from "components/HomeBackground";
import Countdown from "components/Countdown";
import Footer from "components/Footer";
import HomepageContentBackground from "components/HomepageContentBackground";
import AnimatedLogo from "components/AnimatedLogo";
import useWindowDimensions from "hooks/useWindowDimensions";
import {
  EternalTreasuresText,
  ScarcityText,
  TeaserText,
  ValueText,
} from "pages/Homepage/HompageContent";
import AnimatedText from "components/AnimatedText";
import useShowLogoOnScroll from "hooks/useShowLogoOnScroll";
import useMusic from "hooks/useMusic";
import Page from "containers/Page";
import VideoBackground from "components/VideoBackground";
import useMineOpenCountdown from "hooks/useMineOpenCountdown";
import CTAButton from "../../components/CTAButton";
import PlayButton from "components/PlayButton";
import { getEarthAndMoonVideo, getTrailerVideos } from "assets/videos";
import useScrollTop from "hooks/useScrollTop";

const HomeTopContent = () => {
  const countdownProps = useMineOpenCountdown();
  const scroll = useScrollTop();
  const { width, height } = useWindowDimensions();
  const [mousePos, setMousePos] = useState([width / 2, height / 2]);

  useShowLogoOnScroll(3.5);

  const winHeightLimit = height / 2;
  const topViewEffectScrollLimit =
    scroll < winHeightLimit ? scroll : winHeightLimit;

  const topViewStyles = useMemo(() => {
    return {
      opacity: 1 - (scroll * 1.5) / winHeightLimit,
      transform: `scale(${1 - scroll / winHeightLimit / 1.5})`,
    };
  }, [topViewEffectScrollLimit]);

  const trailerSources = getTrailerVideos(width, height);

  return (
    <div
      className="top-content center-aligned-column"
      onMouseMove={(e) => setMousePos([e.pageX, e.pageY])}
    >
      <HomeBackground mousePos={mousePos} />
      <div className="opening" style={topViewStyles}>
        <div className="logo">
          <AnimatedLogo withText />
        </div>
        <div className="tagline-text">
          The first ever virtual diamond mining experience
        </div>
        <div>
          <CTAButton className="lg" />
        </div>
        <div className="center-center-aligned-row buttons-row">
          <PlayButton className="element" videos={trailerSources} index={0} />
          <PlayButton
            className="element second"
            videos={trailerSources}
            index={1}
          />
        </div>
        <div className="countdown-container">
          <div className="text">MINE WILL OPEN IN</div>
          <Countdown {...countdownProps} />
        </div>
      </div>
    </div>
  );
};

const Homepage = () => {
  const dispatch = useDispatch();
  const { width, height } = useWindowDimensions();

  useMusic("homepage.mp3");

  useEffect(() => {
    dispatch(setSelectedTokenId(-1));
  }, []);

  return (
    <Page
      pageName="homepage"
      images={[
        getCDNImageUrl("/homepage/sky.jpg"),
        getCDNImageUrl("/homepage/homepage-mountains-back.png"),
        getCDNImageUrl("/homepage/homepage-mountains-front.png"),
      ]}
    >
      <div className="page homepage">
        <HomeTopContent />
        <div className="homepage-content">
          <HomepageContentBackground />
          <div className="eternal-treasures">
            <AnimatedText className="text-section">
              <EternalTreasuresText />
            </AnimatedText>
          </div>
          <div className="scarcity">
            <AnimatedText className="text-section">
              <ScarcityText />
            </AnimatedText>
          </div>
          <div className="value-section">
            <AnimatedText className="text-section">
              <ValueText />
            </AnimatedText>
          </div>
          <div className="the-experiment">
            <AnimatedText className="text-section">
              <TeaserText />
            </AnimatedText>
          </div>
        </div>
        <VideoBackground
          src={getEarthAndMoonVideo(width, height)}
          overlap="-25%"
        />
        <Footer withFAQs />
      </div>
    </Page>
  );
};

export default Homepage;
