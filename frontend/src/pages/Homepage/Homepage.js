import React, { useEffect, useCallback } from "react";
import "./Homepage.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTokenId } from "store/uiReducer";
import { getCDNVideoUrl, isDemoAndAuthSelector } from "utils";
import HomeBackground from "components/HomeBackground";
import Countdown from "components/Countdown";
import Logo from "components/Logo";
import ReactPlayer from "react-player";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import Footer from "components/Footer";

const Homepage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isRestricted = useSelector(isDemoAndAuthSelector(false));

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

  return (
    <div className="page homepage">
      <div className="top-content center-aligned-column">
        <HomeBackground />
        <div className="common-view">
          {/*<AnimatedLogo />*/}
          <Logo withText />
          <div className="secondary-text">
            For the first time in history, a gemological symbiosis
            <br />
            of the virtual and the physical
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
      <div className="eternal-treasures">
        <div className="bg-stars" />
        <div className="grid">
          <div className="space-cell" />
          <div className="title-cell">
            <div className="leading-text">ETERNAL TREASURES</div>
          </div>
          <div className="text-cell">
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
            <br />
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
      <div className="value-text">
        <div className="bg-left-hand" />
        <div className="bg-right-hand" />
        <div className="center-aligned-column text">
          Today’s definition of value is a subject of debate. What makes a thing
          valuable?
          <br />
          With the surge in recent years of NFT artworks that are 100% virtual
          being auctioned in world renowned
          <br />
          auction houses, such as Christie’s and Sotheby’s, and selling for tens
          of
          <br />
          <br />
          millions of dollars, the lines between the physical and virtual are
          becoming progressively more blurred.
          <br />
          Who would have imagined, even as little as a decade ago, that it would
          be possible for a<br />
          digital creation to be equally (or even more) valuable than its
          physical counterpart?
        </div>
      </div>
      <div className="teaser">
        {renderTeaserBg()}
        <div className="center-aligned-column content">
          <div className="text">
            Diamond Dawn is a social experiment that pushes this concept to the
            limit.
            <br />
            For the first time in history, collectors will have the choice to
            create their own digital artwork,
            <br />
            and at the end of their journey, face the ultimate decision -
            whether to keep their art piece
            <br />
            digital, or transform it into physical form.
            <br />
            <br />
            Will they stand by their past notions of the physical being more
            valuable, or follow their
            <br />
            confidence in the blockchain as the future?
            <br />
            <br />
            <div className="text-center">
              <b>What do YOU believe? What do YOU value?</b>
              <br />
              <b>The final choice is yours to make.</b>
            </div>
          </div>
          <PlayCircleOutlineIcon />
          <div>PLAY FULL TRAILER</div>
          <div className="button transparent">REQUEST AN INVITATION</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Homepage;
