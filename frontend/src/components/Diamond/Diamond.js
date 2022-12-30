import React, { useCallback } from "react";
import "./Diamond.scss";
import ReactPlayer from "react-player";
import { getCDNNftUrl, getTokenTrait } from "utils";
import { DIAMOND_ANIMATION_MAPPING, SHAPE_NAME } from "consts";

const Diamond = ({ diamond }) => {
  const { isBurned, stage } = diamond;

  const shape = getTokenTrait(diamond, "Shape") || SHAPE_NAME.NO_SHAPE;

  const fileName = isBurned
    ? "burn.mp4"
    : DIAMOND_ANIMATION_MAPPING[stage][shape];
  const videoUrl = getCDNNftUrl(fileName);

  const renderPlayer = useCallback(() => {
    return (
      <ReactPlayer
        url={videoUrl}
        playing
        playsinline
        controls={false}
        muted
        loop
        className="react-player"
      />
    );
  }, [videoUrl]);

  return <div className="diamond-art">{renderPlayer()}</div>;
};

export default Diamond;
