import React from "react";
import "./Diamond.scss";
import { getCDNNftUrl, getTokenTrait } from "utils";
import InlineVideo from "components/VideoPlayer/InlineVideo";

const Diamond = ({ diamond, ...props }) => {
  const videoUrl = getCDNNftUrl("logo.mp4");

  return (
    <div className="diamond-art">
      <InlineVideo src={videoUrl} {...props} />
    </div>
  );
};

export default Diamond;
