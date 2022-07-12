import React from 'react'
import './Diamond.scss'
import ReactPlayer from "react-player";

const Diamond = ({ diamond }) => {
  const { animation_url } = diamond

  return (
    <div className="diamond-art">
      {animation_url.endsWith('.mp4') ? (
        <ReactPlayer
          url={animation_url}
          playing
          playsinline
          controls={false}
          muted
          loop
          className="react-player"
        />
      ) : (
        <img src={animation_url} alt="Diamond art" />
      )}
    </div>
  )
}

export default Diamond
