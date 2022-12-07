import React from "react";
import "./PlayButton.scss";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import classNames from "classnames";
import { useDispatch } from "react-redux";
import { showVideo } from "store/videoReducer";
import useButtonSFX from "hooks/useButtonSFX";
import { getCDNVideoUrl } from "utils";

export const TRAILERS = [
  { src: getCDNVideoUrl("digital-trailer.mp4"), name: "THE DIGITAL" },
  { src: getCDNVideoUrl("physical-teaser.webm"), name: "THE PHYSICAL" },
];

const PlayButton = ({ className, videos, index, onClick }) => {
  const dispatch = useDispatch();

  const { src, name } = videos[index];
  const disabled = !src;

  const onPlayClick = () => {
    if (disabled) return;

    onClick && onClick();
    setTimeout(() => {
      dispatch(showVideo(videos, index, { delayPlay: 1500 }));
    }, 0);
  };

  const { clickWithSFX, hoverWithSFX } = useButtonSFX(onPlayClick, "explore");

  return (
    <div
      className={classNames("center-aligned-row", className, "play-button")}
      onMouseEnter={hoverWithSFX}
      onClick={clickWithSFX}
    >
      <PlayCircleOutlineIcon />
      <div className="left-centered-aligned-column links-column">
        <div className={"video-link"}>{name}</div>
      </div>
    </div>
  );
};

export default PlayButton;
