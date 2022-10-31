import React, {useEffect, useState} from "react";
import "./HomeBackground.scss";
import {useDispatch, useSelector} from "react-redux";
import {uiSelector, updateUiState} from "store/uiReducer";

const HomeBackground = () => {
  const { scroll } = useSelector(uiSelector)
  const dispatch = useDispatch()

  return (
    <div className="home-background">
      <div className="bg-leaves left" />
      <div className="bg-leaves right" />
      <div className="bg parallax" style={{ transform: `translate3D(0px, -${scroll * .3}px, 0px)`}} />
      <div className="bg parallax" style={{ transform: `translate3D(0px, -${scroll * .6}px, 0px)`}} />
      <div className="bg parallax" style={{ transform: `translate3D(0px, -${scroll * 1}px, 0px)`}} />
    </div>
  );
};

export default HomeBackground;
