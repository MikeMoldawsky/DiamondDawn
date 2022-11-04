import React from "react";
import "./PlayButton.scss";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

const PlayButton = () => (
  <div className="center-aligned-column play-button">
    <PlayCircleOutlineIcon />
    <div>PLAY FULL TRAILER</div>
  </div>
);

export default PlayButton;
