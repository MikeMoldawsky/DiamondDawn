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
import { getCDNObjectUrl, isDemo } from "utils";

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
  const { demoAuth } = useSelector(uiSelector);
  const navigate = useNavigate();

  useEffect(() => {
    isDemo() && !demoAuth && navigate("/coming-soon");
    dispatch(setSelectedTokenId(-1));
  }, []);

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
    <div className="page homepage" onScroll={handleScroll}>
      <div className="bg-stars" />
      <div className="bg" />
      <div className="box box-top">
        <CommonView
          leadingText="A BILLION YEARS IN THE MAKING"
          secondaryText="the first ever diamond mining experience, from NFT to reality"
        >
          <img src={getCDNObjectUrl("/images/infinity_logo.png")} alt="" />
        </CommonView>
        <EnterButton />
      </div>
      <div id="video" className="box center-aligned-column box-middle">
        <VideoPlayer
          id="home-video"
          videoPlayer={videoPlayer}
          src={getCDNObjectUrl("/videos/teaser.mp4")}
          controls
          playing={playVideo}
        />
      </div>
    </div>
  );
};

export default Homepage;
