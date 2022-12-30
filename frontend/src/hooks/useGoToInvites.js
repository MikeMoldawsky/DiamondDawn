import React from "react";
import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setSideMenuOpen, updateUiState} from "store/uiReducer";
import {collectorSelector} from "store/collectorReducer";

const useGoToInvites = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const collector = useSelector(collectorSelector)

  return () => {
    if (!collector) return;
    
    if (collector.minted || collector.mintClosed) {
      dispatch(setSideMenuOpen(true))
      return
    }
    dispatch(updateUiState({ mintViewShowInvites: true }));
    navigate("/collector");
  };
};

export default useGoToInvites;
