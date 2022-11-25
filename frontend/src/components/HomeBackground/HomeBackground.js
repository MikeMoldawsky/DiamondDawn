import React from "react";
import "./HomeBackground.scss";
import { useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import useWindowDimensions from "hooks/useWindowDimensions";

const HomeBackground = ({ mousePos }) => {
  const { scroll } = useSelector(uiSelector);
  const { width } = useWindowDimensions();

  const parallaxRef = 0.05;

  const scrollWithMouse = scroll * 12 + mousePos[1] / 2

  return (
    <div className="bg home-background">
      <div className="bg leaves-left"
           style={{
             transform: `translate3D(${(width - mousePos[0] * 8) / 90}px, -${scrollWithMouse * parallaxRef * 1.5}px, 0px)`,
           }}
      />
      <div className="bg leaves-right"
           style={{
             transform: `translate3D(${((width - mousePos[0] * 8) / 90) + width / 40}px, -${scrollWithMouse * parallaxRef * 1.5}px, 0px)`,
           }}
      />
      <div className="bg sky" />
      <div
        className="bg mountains-back"
        style={{
          transform: `translate3D(${(width - mousePos[0] * 1) / 90}px, -${(scrollWithMouse * parallaxRef) / 5}px, 0px)`,
        }}
      />
      <div
        className="bg mountains-front"
        style={{
          transform: `translate3D(${(width - mousePos[0] * 4) / 90}px, -${scrollWithMouse * parallaxRef}px, 0px)`,
        }}
      />
      <div
        className="bg black-box"
        style={{
          transform: `translate3D(0px, -${scrollWithMouse * parallaxRef}px, 0px)`,
        }}
      />
      <div className="bg stars" />
    </div>
  );
};

export default HomeBackground;
