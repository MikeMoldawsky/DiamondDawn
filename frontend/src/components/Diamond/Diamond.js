import React, { useCallback } from "react";
import "./Diamond.scss";
import ReactPlayer from "react-player";

const Diamond = ({ diamond }) => {
  const { image, isBurned } = diamond;

  const videoUrl = isBurned
    ? "https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/burn.mp4"
    : image;

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

  return (
    <div className="diamond-art">{renderPlayer()}</div>
  );
};

export default Diamond;
