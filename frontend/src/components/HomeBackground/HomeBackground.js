import React from "react";
import "./HomeBackground.scss";
import { useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";

const HomeBackground = () => {
  const { scroll } = useSelector(uiSelector);

  const parallaxRef = 0.5;

  return (
    <div className="bg home-background">
      <div className="bg leaves-left" />
      <div className="bg leaves-right" />
      <div
        className="bg sky"
        style={{
          transform: `translate3D(0px, -${(scroll * parallaxRef) / 10}px, 0px)`,
        }}
      />
      <div
        className="bg mountains-back"
        style={{
          transform: `translate3D(0px, -${(scroll * parallaxRef) / 5}px, 0px)`,
        }}
      />
      <div
        className="bg mountains-front"
        style={{
          transform: `translate3D(0px, -${scroll * parallaxRef}px, 0px)`,
        }}
      />
      <div
        className="bg black-box"
        style={{
          transform: `translate3D(0px, -${scroll * parallaxRef}px, 0px)`,
        }}
      />
      <div className="bg stars" />
    </div>
  );
};

export default HomeBackground;
