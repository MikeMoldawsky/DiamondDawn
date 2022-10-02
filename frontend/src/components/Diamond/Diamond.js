import React, { useCallback } from "react";
import "./Diamond.scss";
import ReactPlayer from "react-player";
import _ from "lodash";

const Diamond = ({ diamond }) => {
  const { image, isBurned } = diamond;

  const videoUrl = isBurned
    ? "https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/burn.mp4"
    : image;

  const renderPlayer = useCallback(() => {
    return (
      <ReactPlayer
        url={_.startsWith(videoUrl, 'ar://') ? _.replace(videoUrl, 'ar://', 'https://arweave.net/'): videoUrl}
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
