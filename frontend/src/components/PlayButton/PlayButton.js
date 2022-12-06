import React from "react";
import "./PlayButton.scss";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import classNames from "classnames";
import { useDispatch } from "react-redux";
import { showVideo } from "store/videoReducer";
import useButtonSFX from "hooks/useButtonSFX";

const VideoLink = ({ src, length, name }) => {
  const dispatch = useDispatch();
  const disabled = !src;

  const onClick = () => {
    !disabled && setTimeout(() => {
      dispatch(showVideo(src, { delayPlay: 1500 }));
    }, 0)
  };

  const { clickWithSFX } = useButtonSFX(onClick, "explore");

  return (
    <div
      className={classNames("video-link link-hover", { disabled })}
      title={
        disabled ? "Full trailer will be released when public sale starts" : ""
      }
      onClick={clickWithSFX}
    >
      {length} {name} TRAILER
    </div>
  );
};

const PlayButton = ({ className, sources = {}, name }) => {
  const { hoverWithSFX } = useButtonSFX(null, "explore");

  return (
    <div
      className={classNames("center-aligned-row", className, "play-button")}
      onMouseEnter={hoverWithSFX}
    >
      <PlayCircleOutlineIcon />
      <div className="left-centered-aligned-column links-column">
        <VideoLink src={sources["SHORT"]} length="SHORT" name={name} />
        <VideoLink src={sources["FULL"]} length="FULL" name={name} />
      </div>
    </div>
  );
};

export default PlayButton;
