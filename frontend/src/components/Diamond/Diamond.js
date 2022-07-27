import React from 'react'
import './Diamond.scss'
import ReactPlayer from "react-player";

const Diamond = ({ diamond }) => {
  const { image } = diamond

  return (
    <div className="diamond-art">
      {image.endsWith('.mp4') ? (
        <ReactPlayer
          url={image}
          playing
          playsinline
          controls={false}
          muted
          loop
          className="react-player"
        />
      ) : (
        <img src={image} alt="Diamond art" />
      )}
    </div>
  )
}

export default Diamond
