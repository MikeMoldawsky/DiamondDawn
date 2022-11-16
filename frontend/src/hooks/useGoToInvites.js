import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUiState } from "store/uiReducer";

const useGoToInvites = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return () => {
    dispatch(updateUiState({ mintViewShowInvites: true }));
    navigate("/collector");
  };
};

export default useGoToInvites;
