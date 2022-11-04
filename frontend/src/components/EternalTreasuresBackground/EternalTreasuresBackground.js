import React, {useCallback, useState} from "react";
import "./EternalTreasuresBackground.scss";
import ReactPlayer from "react-player";
import {getCDNVideoUrl} from "utils";
import classNames from "classnames";

const EternalTreasuresBackground = () => {

  const renderTeaserBg = useCallback(
    () => (
      <ReactPlayer
        url={getCDNVideoUrl("teaser-short.mp4")}
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

  return (
    <div className="eternal-treasures-background">
      {/*<div className="bg glow" />*/}
      <div className="bg statue">
        <ReactPlayer
          url={getCDNVideoUrl("rough-stone.webm")}
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
      {/*<div className="bg mine-wall-bottom" />*/}
      <div className="bg mine-wall-left" />
      <div className="bg bg-right-hand" />
      <div className="bg bg-left-hand" />
      <div className="bg bg-teaser">
        {renderTeaserBg()}
      </div>
    </div>
  );
};

export default EternalTreasuresBackground;
