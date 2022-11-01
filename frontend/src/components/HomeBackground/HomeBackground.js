import React from "react";
import "./HomeBackground.scss";
import {useSelector} from "react-redux";
import {uiSelector} from "store/uiReducer";

const HomeBackground = () => {
  const { scroll } = useSelector(uiSelector)

  return (
    <div className="home-background">
      <div className="bg leaves-left" />
      <div className="bg leaves-right" />
      <div className="bg parallax sky" style={{ transform: `translate3D(0px, -${scroll * .3}px, 0px)`}} />
      <div className="bg parallax mountains-back" style={{ transform: `translate3D(0px, -${scroll * .6}px, 0px)`}} />
      <div className="bg parallax mountains-front" style={{ transform: `translate3D(0px, -${scroll * 1}px, 0px)`}} />
      <div className="bg black-box"/>
    </div>
  );
};

export default HomeBackground;
