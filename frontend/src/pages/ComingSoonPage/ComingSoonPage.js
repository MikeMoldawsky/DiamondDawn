import React, { useCallback, useState } from "react";
import "./ComingSoonPage.scss";
import ReactPlayer from "react-player";
import PasswordBox from "components/PasswordBox";
import { updateUiState } from "store/uiReducer";
import { useDispatch } from "react-redux";
import { getCDNVideoUrl, isDemo } from "utils";
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
        url={getCDNVideoUrl("coming_soon.mp4")}
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
    console.log("process.env", process.env);
    if (process.env.REACT_APP_ENABLE_TRANSITIONS !== "true") {
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
    localStorage.setItem("demoAuth", "true");
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
          <div className="secondary-2">
            Physical or Digital
          </div>
          Which diamond will you choose?
        </div>
        {isDemo() ? (
          <PasswordBox
            onCorrect={onCorrectPassword}
            passwordLength={8}
            buttonText="EXPLORE"
          />
        ) : (
          <div className="button transparent" onClick={transition}>
            EXPLORE
          </div>
        )}
      </div>
    </div>
  );
};

export default ComingSoonPage;
