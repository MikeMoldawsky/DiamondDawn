import React, { useCallback, useState } from "react";
import "./ComingSoonPage.scss";
import ReactPlayer from "react-player";
import PasswordBox from "components/PasswordBox";
import { updateUiState } from "store/uiReducer";
import { useDispatch } from "react-redux";
import { getCDNObjectUrl, isDemo } from "utils";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import HomeBackground from "components/HomeBackground";

const ComingSoonPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [startTransition, setStartTransition] = useState(false);

  const renderBgPlayer = useCallback(
    () => (
      <ReactPlayer
        url={getCDNObjectUrl("/videos/coming_soon.mp4")}
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

  const transition = () => {
    if (!process.env.REACT_APP_ENABLE_TRANSITIONS) {
      return navigate("/explore");
    }

    setStartTransition(true);

    const EFFECT_TIME_MULTIPLIER = 2;

    setTimeout(() => {
      navigate("/explore");
    }, 2850 * EFFECT_TIME_MULTIPLIER);
  };

  const onCorrectPassword = () => {
    dispatch(updateUiState({ demoAuth: true }));
    transition();
  };

  return (
    <div
      className={classNames("page coming-soon", {
        horizontal: true,
        "transition-out": startTransition,
      })}
    >
      {renderBgPlayer()}
      <div className="curtain-left" />
      <div className="curtain-right" />
      <div className="curtain-behind">
        <HomeBackground />
      </div>
      <div className="center-aligned-column content">
        <div className="leading-text">COMING SOON</div>
        <div className="secondary-text">
          Virtual or Physical.
          <br />
          Which diamond will you choose?
        </div>
        {isDemo() ? (
          <PasswordBox onCorrect={onCorrectPassword} />
        ) : (
          <div className="button" onClick={transition}>
            EXPLORE
          </div>
        )}
      </div>
    </div>
  );
};

export default ComingSoonPage;
