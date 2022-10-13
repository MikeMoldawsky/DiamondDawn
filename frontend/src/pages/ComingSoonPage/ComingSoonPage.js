import React, { useCallback } from "react";
import "./ComingSoonPage.scss";
import ReactPlayer from "react-player";
import PasswordBox from "components/PasswordBox";
import { updateUiState } from "store/uiReducer";
import { useDispatch } from "react-redux";
import {getCDNObjectUrl, isDemo} from "utils";

const ComingSoonPage = () => {
  const dispatch = useDispatch();

  const renderBgPlayer = useCallback(
    () => (
      <ReactPlayer
        url={getCDNObjectUrl('COMING_SOON_3_LOOPS_LR.mp4')}
        playing
        playsinline
        controls={false}
        className="react-player"
        muted
        loop
      />
    ),
    []
  );

  const onCorrectPassword = () => {
    dispatch(updateUiState({ demoAuth: true }));
  };

  return (
    <div className="page coming-soon">
      {renderBgPlayer()}
      <div className="center-aligned-column content">
        <div className="leading-text">COMING SOON</div>
        <div className="secondary-text">
          The first-ever virtual diamond mining experience that merges the
          digital with the tangible
        </div>
        {isDemo() && <PasswordBox onCorrect={onCorrectPassword} />}
      </div>
    </div>
  );
};

export default ComingSoonPage;
