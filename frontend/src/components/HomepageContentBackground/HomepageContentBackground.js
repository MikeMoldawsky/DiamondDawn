import React, {useState} from "react";
import "./HomepageContentBackground.scss";
import ReactPlayer from "react-player";
import classNames from "classnames";
import { getRoughStoneSpinVideo } from "assets/videos";
import useWindowDimensions from "hooks/useWindowDimensions";

const HomepageContentBackground = () => {
  const { width } = useWindowDimensions();
  // fix for IOS - stone animation not working
  const [isStoneMoving, setIsStoneMoving] = useState(false)

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
          className={classNames("react-player rough-diamond", { moving: isStoneMoving })}
          width=""
          height=""
          onStart={() => setIsStoneMoving(true)}
        />
      </div>
      <div className="bg mine-wall-left" />
      <div className="bg bg-right-hand" />
      <div className="bg bg-left-hand" />
    </div>
  );
};

export default HomepageContentBackground;
