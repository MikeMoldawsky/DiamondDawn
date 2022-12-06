import React from "react";
import "./PlayButton.scss";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import classNames from "classnames";
import { useDispatch } from "react-redux";
import { showVideo } from "store/videoReducer";
import useButtonSFX from "hooks/useButtonSFX";

const PlayButton = ({ className, src, name }) => {
  const dispatch = useDispatch();
  const disabled = !src;

  const onClick = () => {
    !disabled &&
    setTimeout(() => {
      dispatch(showVideo(src, { delayPlay: 1500 }));
    }, 0);
  };

  const { clickWithSFX, hoverWithSFX } = useButtonSFX(onClick, "explore");

  return (
    <div
      className={classNames("center-aligned-row", className, "play-button")}
      onMouseEnter={hoverWithSFX}
    >
      <PlayCircleOutlineIcon />
      <div className="left-centered-aligned-column links-column">
        <div className={"video-link link-hover"} onClick={clickWithSFX}>
          THE {name}
        </div>
      </div>
    </div>
  );
};

export default PlayButton;
