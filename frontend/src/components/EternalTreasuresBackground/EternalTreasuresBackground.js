import React from "react";
import "./EternalTreasuresBackground.scss";
import roughStone from 'assets/videos/rough-stone.webm'
import classNames from "classnames";
import ReactPlayer from "react-player";

const EternalTreasuresBackground = () => {
  return (
    <div className="eternal-treasures-background">
      <div className="bg stars" />
      <div className="bg statue" />
      <div className="bg mine-rocks" />
      <div className="bg mine-rock-front" />
      <div className="bg bg-right-hand" />
      <div className="bg bg-left-hand" />
      <ReactPlayer
        url={roughStone}
        playing
        playsinline
        controls={false}
        muted
        loop
        className={classNames("react-player bg-element rough-diamond")}
        width=""
        height=""
      />
    </div>
  );
};

export default EternalTreasuresBackground;
