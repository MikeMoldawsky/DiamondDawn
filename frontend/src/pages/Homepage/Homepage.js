import React, { useEffect, useMemo, useState } from "react";
import "./Homepage.scss";
import { useDispatch } from "react-redux";
import { setSelectedTokenId } from "store/uiReducer";
import { getCDNImageUrl } from "utils";
import HomeBackground from "components/HomeBackground";
import Footer from "components/Footer";
import HomepageContentBackground from "components/HomepageContentBackground";
import AnimatedLogo from "components/AnimatedLogo";
import useWindowDimensions from "hooks/useWindowDimensions";
import { DiamondDawnText } from "./HompageContent";
import AnimatedText from "components/AnimatedText";
import useShowLogoOnScroll from "hooks/useShowLogoOnScroll";
import useMusic from "hooks/useMusic";
import Page from "containers/Page";
import VideoBackground from "components/VideoBackground";
import { getEarthAndMoonVideo } from "assets/videos";
import useScrollTop from "hooks/useScrollTop";
import { useMobileOrTablet } from "hooks/useMediaQueries";
import { NavHashLink } from "react-router-hash-link";
import JourneyPhases from "components/JourneyPhases";
import CTAAndTrailers from "components/CTAAndTrailers";

const HomeTopContent = () => {
  const scroll = useScrollTop();
  const { width, height } = useWindowDimensions();
  const [mousePos, setMousePos] = useState([width / 2, height / 2]);
  const isMobileOrTablet = useMobileOrTablet();
  const scrollOffset = isMobileOrTablet ? height / 3 : height / 5;
  const fixedScroll = scroll - scrollOffset;

  useShowLogoOnScroll(3.5);

  const winHeightLimit = height / 2;
  const topViewEffectScrollLimit =
    fixedScroll < winHeightLimit ? fixedScroll : winHeightLimit;

  const topViewStyles = useMemo(() => {
    if (fixedScroll < 0) return {};

    const opacity = 1 - (fixedScroll * 1.5) / winHeightLimit;
    const scale = 1 - fixedScroll / winHeightLimit / 1.5;
    return {
      opacity: opacity > 0 ? opacity : 0,
      transform: `scale(${scale > 0 ? scale : 0})`,
    };
  }, [topViewEffectScrollLimit, isMobileOrTablet]);

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
        <CTAAndTrailers />
        {/*<SystemCountdown />*/}
      </div>
    </div>
  );
};

const ArtByDavid = () => (
  <div className="center-bottom-aligned-row art-by-david">
    <div className="profile-image david" />
    <div className="left-centered-aligned-column">
      <div className="art-by">Art by</div>
      <div className="subtitle-text by-david">
        <NavHashLink to={`/about-us/#david`} smooth className="text-gold">
          DAVID ARIEW
        </NavHashLink>
      </div>
    </div>
  </div>
);

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
        <ArtByDavid />
        <div className="homepage-content">
          <HomepageContentBackground />
          <div className="eternal-treasures">
            <AnimatedText className="text-section">
              <DiamondDawnText />
            </AnimatedText>
          </div>
          <div className="center-center-aligned-row journey-section">
            <JourneyPhases />
          </div>
        </div>
        <VideoBackground src={getEarthAndMoonVideo(width, height)} />
        <Footer withFAQs />
      </div>
    </Page>
  );
};

export default Homepage;
