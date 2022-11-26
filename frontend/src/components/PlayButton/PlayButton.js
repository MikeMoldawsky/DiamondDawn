import React from "react";
import "./PlayButton.scss";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import classNames from "classnames";
import {useDispatch} from "react-redux";
import { showVideo } from "store/videoReducer";
import useButtonSFX from "hooks/useButtonSFX";

const PlayButton = ({ className, src, length, disabled, title }) => {
  const dispatch = useDispatch();

  const onClick = () => {
    !!src && dispatch(showVideo(src));
  };

  const { hoverWithSFX, clickWithSFX } = useButtonSFX(onClick, "explore")

  return (
    <div
      className={classNames(
        "center-aligned-column play-button",
        { disabled },
        className
      )}
      title={title}
      onMouseEnter={hoverWithSFX}
      onClick={clickWithSFX}
    >
      <PlayCircleOutlineIcon />
      <div>PLAY {length} TRAILER</div>
    </div>
  );
};

export default PlayButton;
