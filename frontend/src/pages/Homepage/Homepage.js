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
            <div className="leading-text">ETERNAL TREASURES</div>
            <div className="text">
              Deep below the earth’s surface, under immense pressure and
              scorching heat over billions of years, a marvel of nature is
              formed. A diamond.
              <br />
              For thousands of years, they have been the ultimate symbol of
              wealth and abundance.
              <br />
              Precious and enduring, we crown royalty with them, hand them down
              as family heirlooms, and swear our eternal love with them. A
              single diamond, smaller than a pea, can cost tens of millions of
              dollars for its clarity and color.
            </div>
            <div className="text">
              <b>But are diamonds REALLY that rare?</b>
            </div>
          </div>
        </div>
        <div className="scarcity">
          <div className="text-section">
            <div className="leading-text">SCARCITY</div>
            <p className="text">
              The recent rise of lab-grown diamonds makes it impossible for
              anyone to distinguish a ‘real’ diamond from a man-made one without
              special equipment.
              <br />
              Not only that, but it’s largely unknown that big diamond companies
              keep vast quantities of diamonds hidden away in massive vaults,
              controlling the circulating supply of the diamond market.
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
        <div className="value-section">
          <div className="text-section">
            <div className="leading-text">VALUE</div>
            <p className="text">
              Today’s definition of value is a subject of debate. What makes a
              thing valuable?
              <br />
              With the recent rise of NFT technology, the lines between the
              physical and virtual worlds have become blurred.
              <br />
              Purely digital artworks are auctioned in world-renowned auction
              houses, such as Christie’s and Sotheby’s, selling for tens of
              millions of dollars.
              <br />
              Who would have imagined, even as little as a decade ago, that it
              would be possible for a digital creation to be equally (or even
              more) valuable than its physical counterpart?
            </p>
          </div>
        </div>
      </div>

      <div className="teaser">
        {renderTeaserBg()}
        <div className="center-aligned-column content">
          <div className="leading-text">DIAMOND DAWN</div>
          <p className="text">
            Diamond Dawn is a social experiment that pushes this concept to the
            limit.
            <br />
            <br />
            For the first time in history, collectors will have the choice to
            create their digital diamond and, at the end of their journey, face
            the ultimate decision - whether to keep their diamond art digital or
            transform it into physical form.
            <br />
            <br />
            Will they stand by their past notions of the physical being more
            valuable, or follow their confidence in the blockchain as the
            future?
            <br />
            <br />
            <div className="text-center">
              <b>What do YOU believe? What do YOU value?</b>
              <br />
              <b>The final choice is yours to make.</b>
            </div>
          </p>
          <PlayCircleOutlineIcon />
          <div>PLAY FULL TRAILER</div>
          <div className="button transparent">REQUEST AN INVITATION</div>
        </div>
      </div>
      <Footer />
    </ScrollingPage>
  );
};

export default Homepage;
