import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiSelector, updateUiState } from "store/uiReducer";
import useWindowDimensions from "hooks/useWindowDimensions";

const useShowLogoOnScroll = (screenThreshold) => {
  const dispatch = useDispatch();
  const { scroll, showHPLogo } = useSelector(uiSelector);
  const { height } = useWindowDimensions();

  const winHeightLimitForLogo = height / screenThreshold;
  const topViewEffectScrollLimitForLogo =
    scroll < winHeightLimitForLogo ? scroll : winHeightLimitForLogo;

  useEffect(() => {
    if (topViewEffectScrollLimitForLogo === winHeightLimitForLogo) {
      dispatch(updateUiState({ showHPLogo: true }));
    } else if (showHPLogo) {
      dispatch(updateUiState({ showHPLogo: false }));
    }
  }, [topViewEffectScrollLimitForLogo]);

  useEffect(() => {
    return () => {
      dispatch(updateUiState({ scroll: 0, showHPLogo: null }));
    };
  }, []);
};

export default useShowLogoOnScroll;
