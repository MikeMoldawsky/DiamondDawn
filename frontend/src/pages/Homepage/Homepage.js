import React, { useEffect, useMemo, useState } from "react";
import "./Homepage.scss";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTokenId, uiSelector } from "store/uiReducer";
import { getCDNImageUrl, getCDNVideoUrl } from "utils";
import HomeBackground from "components/HomeBackground";
import Countdown from "components/Countdown";
import Footer from "components/Footer";
import ScrollingPage from "components/ScrollingPage";
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
import PageSizeLimit from "components/PageSizeLimit/PageSizeLimit";
import VideoBackground from "components/VideoBackground";
import useMineOpenCountdown from "hooks/useMineOpenCountdown";
import CTAButton from "../../components/CTAButton";
import PlayButton from "components/PlayButton";

const Homepage = () => {
  const countdownProps = useMineOpenCountdown();
  const dispatch = useDispatch();
  const { scroll } = useSelector(uiSelector);
  const { width, height } = useWindowDimensions();
  useShowLogoOnScroll(3.5);
  const [mousePos, setMousePos] = useState([width / 2, height / 2]);

  useMusic("homepage.mp3");

  useEffect(() => {
    dispatch(setSelectedTokenId(-1));
  }, []);

  const winHeightLimit = height / 2;
  const topViewEffectScrollLimit =
    scroll < winHeightLimit ? scroll : winHeightLimit;

  const topViewStyles = useMemo(() => {
    return {
      opacity: 1 - (scroll * 1.5) / winHeightLimit,
      transform: `scale(${1 - scroll / winHeightLimit / 1.5})`,
    };
  }, [topViewEffectScrollLimit]);

  return (
    <PageSizeLimit>
      <Page
        pageName="homepage"
        images={[
          getCDNImageUrl("/homepage/sky.jpg"),
          getCDNImageUrl("/homepage/homepage-mountains-back.png"),
          getCDNImageUrl("/homepage/homepage-mountains-front.png"),
        ]}
      >
        <ScrollingPage className="homepage">
          <div className="page homepage">
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
                  <PlayButton
                    className="element"
                    name="DIGITAL"
                    src={getCDNVideoUrl("short-teaser.webm")}
                  />
                  {/*<div className="separator" />*/}
                  <PlayButton
                    className="element"
                    name="PHYSICAL"
                    src={getCDNVideoUrl("physical-teaser.webm")}
                  />
                </div>
                <div className="countdown-container">
                  <div className="text">MINE WILL OPEN IN</div>
                  <Countdown {...countdownProps} />
                </div>
              </div>
            </div>
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
            <VideoBackground src="earth-and-moon.webm" overlap="-35%" />
            <Footer withFAQs />
          </div>
        </ScrollingPage>
      </Page>
    </PageSizeLimit>
  );
};

export default Homepage;
