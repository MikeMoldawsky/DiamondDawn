import React from "react";
import "./Diamond.scss";
import { getCDNNftUrl, getTokenTrait } from "utils";
import { DIAMOND_ANIMATION_MAPPING, SHAPE_NAME } from "consts";
import InlineVideo from "components/VideoPlayer/InlineVideo";

const Diamond = ({ diamond, ...props }) => {
  const { isBurned, stage } = diamond;

  const shape = getTokenTrait(diamond, "Shape") || SHAPE_NAME.NO_SHAPE;

  const fileName = isBurned
    ? "burn.mp4"
    : DIAMOND_ANIMATION_MAPPING[stage][shape];
  const videoUrl = getCDNNftUrl(fileName);

  return (
    <div className="diamond-art">
      <InlineVideo src={videoUrl} {...props} />
    </div>);
};

export default Diamond;
