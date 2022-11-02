import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateUiState } from "store/uiReducer";
import classNames from "classnames";

const ScrollingPage = ({ className, children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(updateUiState({ scroll: 0 }));
    };
  }, []);

  const handleScroll = (event) => {
    dispatch(updateUiState({ scroll: event.currentTarget.scrollTop }));
  };

  return (
    <div className={classNames("page", className)} onScroll={handleScroll}>
      {children}
    </div>
  );
};

export default ScrollingPage;
