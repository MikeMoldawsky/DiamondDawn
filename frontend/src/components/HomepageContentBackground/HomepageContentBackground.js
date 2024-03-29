import React from "react";
import "./HomepageContentBackground.scss";
import ReactPlayer from "react-player";
import { getRoughStoneSpinVideo } from "assets/videos";
import useWindowDimensions from "hooks/useWindowDimensions";

const HomepageContentBackground = () => {
  const { width } = useWindowDimensions();

  return (
    <div className="bg homepage-content-background">
      <div className="bg glow" />
      <div className="bg statue">
        <ReactPlayer
          url={getRoughStoneSpinVideo(width)}
          playing
          playsinline
          controls={false}
          muted
          loop
          className={"react-player rough-diamond"}
          width=""
          height=""
        />
      </div>
      <div className="bg mine-wall-left" />
      <div className="bg bg-right-hand" />
      <div className="bg bg-left-hand" />
    </div>
  );
};

export default HomepageContentBackground;
