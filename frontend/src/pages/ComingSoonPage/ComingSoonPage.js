import React, { useCallback } from "react";
import "./ComingSoonPage.scss";
import ReactPlayer from "react-player";
import PasswordBox from "components/PasswordBox";
import {useNavigate} from "react-router-dom";
import DemoOnly from 'components/DemoOnly'
import {updateUiState} from "store/uiReducer";
import {useDispatch} from "react-redux";

const ComingSoonPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const renderBgPlayer = useCallback(
    () => (
      <ReactPlayer
        url="https://tweezers-public.s3.us-east-1.amazonaws.com/COMING_SOON.mp4"
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
    dispatch(updateUiState({ demoAuth: true }))
  }

  return (
    <div className="page coming-soon">
      {renderBgPlayer()}
      <div className="center-aligned-column content">
        <div className="leading-text">COMING SOON</div>
        <div className="secondary-text">
          The first-ever virtual diamond mining experience that merges the
          digital with the tangible
        </div>
        <DemoOnly>
          <PasswordBox onCorrect={onCorrectPassword} />
        </DemoOnly>
      </div>
    </div>
  );
};

export default ComingSoonPage;
