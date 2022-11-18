import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateUiState } from "store/uiReducer";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";

const ScrollingPage = ({ children }) => {
  const dispatch = useDispatch();

  useScrollPosition(({ prevPos, currPos }) => {
    dispatch(updateUiState({ scroll: Math.abs(currPos.y) }));
  }, []);

  useEffect(() => {
    return () => {
      dispatch(updateUiState({ scroll: 0 }));
    };
  }, []);

  return children;
};

export default ScrollingPage;
