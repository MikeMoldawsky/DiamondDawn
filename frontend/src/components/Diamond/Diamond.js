import React, {useCallback} from "react";
import "./Diamond.scss";
import ReactPlayer from "react-player";

const Diamond = ({ diamond }) => {
  const { image, isBurned } = diamond;

  const imageUrl = isBurned
    ? "https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/burn.mp4"
    : image;

  const renderPlayer = useCallback(() => {
    return (
      <ReactPlayer
        url={imageUrl}
        playing
        playsinline
        controls={false}
        muted
        loop
        className="react-player"
      />
    )
  }, [imageUrl])

  return (
    <div className="diamond-art">
      {imageUrl.endsWith(".mp4")
        ? renderPlayer()
        : (
          <img src={imageUrl} alt="Diamond art" />
        )
      }
    </div>
  );
};

export default Diamond;
