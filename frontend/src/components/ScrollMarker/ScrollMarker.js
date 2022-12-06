import React from 'react'
import "./ScrollMarker.scss"

const ScrollMarker = ({ style }) => (
  <div className="scroll-marker" style={style}>
    <div className="mouse" />
    <div className="scroll-text">Scroll</div>
  </div>
)

export default ScrollMarker