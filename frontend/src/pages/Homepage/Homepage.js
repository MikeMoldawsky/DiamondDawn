import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import "./Homepage.scss";
import CommonView from "components/CommonView";
import VideoPlayer from "components/VideoPlayer";
import infinityLogo from "assets/images/infinity-logo.png";
import blackStone from "assets/images/black-stone.png";
import PasswordBox from "components/PasswordBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";
import teaserVideo from "assets/video/teaser.mp4";
import { SYSTEM_STAGE, SYSTEM_STAGE_NAME } from "consts";
import { setSelectedTokenId } from "store/uiReducer";
import TokensProvider from "containers/TokensProvider";

const EnterButton = () => {
  const { systemStage, isActive } = useSelector(systemSelector);
  const canEnter =
    systemStage >= SYSTEM_STAGE.MINE &&
    !(systemStage === SYSTEM_STAGE.SHIP && !isActive);

  return canEnter ? (
    <NavLink to={`/process`}>
      <div className="button text-upper" style={{ marginTop: 40 }}>
        ENTER {SYSTEM_STAGE_NAME[systemStage]}
      </div>
    </NavLink>
  ) : null;
};

const Homepage = () => {
  const navigate = useNavigate();
  const videoPlayer = useRef(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSelectedTokenId(-1));
  }, []);

  const onCorrectPassword = () => {
    // setHasEntered(true)
    navigate("/process");
  };

  const handleScroll = (event) => {
    if (playVideo) return;

    const video = videoPlayer.current;
    const scrollTop = event.currentTarget.scrollTop;
    const videoTop = video.offsetTop + video.offsetParent.offsetTop;
    const startPlayAt = videoTop - video.offsetHeight / 3;

    if (scrollTop > startPlayAt) {
      setPlayVideo(true);
    }
  };

  return (
    <div
      className={classNames("page homepage", { entered: hasEntered })}
      onScroll={handleScroll}
    >
      <div className="bg-stars" />
      <div className="bg" />
      <div className="box box-top">
        <CommonView
          leadingText="A BILLION YEARS IN THE MAKING"
          secondaryText="the first ever diamond mining experience, from NFT to reality"
        >
          <img src={infinityLogo} alt={""} />
        </CommonView>
        <TokensProvider isGated>
          <EnterButton />
        </TokensProvider>
      </div>
      <div id="video" className="box center-aligned-column box-middle">
        <VideoPlayer
          id="home-video"
          videoPlayer={videoPlayer}
          src={teaserVideo}
          controls
          playing={playVideo}
        />
      </div>
      <div className="box center-aligned-column box-bottom">
        <CommonView
          leadingText={[
            "EVERY BIRTH OF A DIAMOND IS A MIRACLE OF NATURE,",
            "BEGINNING ONLY AS A MERE POTENTIAL",
          ]}
          secondaryText="Do you have what it takes to shine?"
        >
          <img src={blackStone} alt="Diamond" />
        </CommonView>
        <PasswordBox onCorrect={onCorrectPassword} />
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
