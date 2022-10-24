import React, {useCallback, useState} from "react";
import "./ComingSoonPage.scss";
import ReactPlayer from "react-player";
import PasswordBox from "components/PasswordBox";
import { updateUiState } from "store/uiReducer";
import { useDispatch } from "react-redux";
import { getCDNObjectUrl, isDemo } from "utils";
import classNames from "classnames";

const ComingSoonPage = () => {
  const dispatch = useDispatch();
  const [startTransition, setStartTransition] = useState(false)

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

  const onCorrectPassword = () => {
    dispatch(updateUiState({ demoAuth: true }));
    setStartTransition(true)
  };

  return (
    <div className={classNames("page coming-soon", { 'transition-out': startTransition })}>
      {renderBgPlayer()}
      <div className="curtain-left" />
      <div className="curtain-right" />
      <div className="curtain-behind" />
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
          <div className="button" onClick={(() => setStartTransition(true))}>ENTER</div>
        )}
      </div>
    </div>
  );
};

export default ComingSoonPage;
