import React, { useEffect, useMemo } from "react";
import "./Homepage.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTokenId, uiSelector } from "store/uiReducer";
import { isDemoAndAuthSelector } from "utils";
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

const Homepage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isRestricted = useSelector(isDemoAndAuthSelector(false));
  const { scroll } = useSelector(uiSelector);
  const { height } = useWindowDimensions();
  useShowLogoOnScroll(3.5);

  useEffect(() => {
    isRestricted && navigate("/");
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
    <ScrollingPage className="homepage">
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
            <Countdown
              customMode
              parts={{ days: 24, hours: 3, minutes: 0, seconds: 0 }}
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
      <Footer />
    </ScrollingPage>
  );
};

export default Homepage;
