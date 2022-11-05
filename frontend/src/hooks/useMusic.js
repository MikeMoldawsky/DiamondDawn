import React, {useEffect} from "react";
import { updateUiState } from "store/uiReducer";
import { useDispatch } from "react-redux";

const useMusic = (musicSrc) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateUiState({ musicSrc }))
  }, [])
};

export default useMusic;
