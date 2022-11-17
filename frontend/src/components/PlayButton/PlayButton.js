import React from "react";
import "./PlayButton.scss";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import classNames from "classnames";

const PlayButton = ({ className, length, disabled, title }) => (
  <div className={classNames("center-aligned-column play-button", { disabled }, className)} title={title}>
    <PlayCircleOutlineIcon />
    <div>PLAY {length} TRAILER</div>
  </div>
);

export default PlayButton;
