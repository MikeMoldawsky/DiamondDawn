import React, { useEffect, useMemo } from "react";
import "./Homepage.scss";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTokenId, uiSelector } from "store/uiReducer";
import { getCDNImageUrl } from "utils";
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
import AnimatedText from "components/AnimatedText/AnimatedText";
import useShowLogoOnScroll from "hooks/useShowLogoOnScroll";
import useMusic from "hooks/useMusic";
import Page from "containers/Page";
import PageSizeLimit from "components/PageSizeLimit";
import Button from "components/Button";
import VideoBackground from "components/VideoBackground";
import useMineOpenCountdown from "hooks/useMineOpenCountdown";

const Homepage = () => {
  const countdownProps = useMineOpenCountdown();
  const dispatch = useDispatch();
  const { scroll } = useSelector(uiSelector);
  const { height } = useWindowDimensions();
  useShowLogoOnScroll(3.5);

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
          getCDNImageUrl("/homepage/sky.png"),
          getCDNImageUrl("/homepage/homepage-mountains-back.png"),
          getCDNImageUrl("/homepage/homepage-mountains-front.png"),
        ]}
      >
        <ScrollingPage className="homepage">
          <div className="page homepage">
            <div className="top-content center-aligned-column">
              <HomeBackground />
              <div className="common-view" style={topViewStyles}>
                <div className="logo">
                  <AnimatedLogo withText />
                </div>
                <div className="secondary-text">
                  The first ever virtual diamond mining experience
                </div>
                <div className="countdown-container">
                  <div className="text">MINE WILL OPEN IN</div>
                  <Countdown {...countdownProps} />
                </div>
                <div>
                  <Button
                    className="transparent"
                    disabled
                    sfx="explore"
                    title="Mine open date will be announced soon!"
                  >
                    ENTER MINE
                  </Button>
                </div>
              </div>
            </div>
            <div className="homepage-content">
              <HomepageContentBackground />
              <div className="eternal-treasures">
                <AnimatedText>
                  <EternalTreasuresText />
                </AnimatedText>
              </div>
              <div className="scarcity">
                <AnimatedText animationDirection="ltr">
                  <ScarcityText />
                </AnimatedText>
              </div>
              <div className="value-section">
                <AnimatedText>
                  <ValueText />
                </AnimatedText>
              </div>
              <div className="the-experiment">
                <AnimatedText animationDirection="ltr">
                  <TeaserText />
                </AnimatedText>
              </div>
            </div>
            <VideoBackground src="teaser-short.mp4" overlap="-35%" />
            <Footer />
          </div>
        </ScrollingPage>
      </Page>
    </PageSizeLimit>
  );
};

export default Homepage;
