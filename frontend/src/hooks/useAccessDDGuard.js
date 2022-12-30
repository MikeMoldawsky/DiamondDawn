import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  isActionFirstCompleteSelector,
  isActionSuccessSelector,
} from "store/actionStatusReducer";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import useCanAccessDD from "hooks/useCanAccessDD";

const useAccessDDGuard = (requireAccess = true) => {
  const canAccessDD = useCanAccessDD();
  const isCollectorFetched = useSelector(
    isActionSuccessSelector("get-collector-by-address")
  );
  const navigate = useNavigate();
  const account = useAccount();
  const isCollectorReady = isCollectorFetched || !account?.address;

  // navigate out if doesn't have access
  useEffect(() => {
    if (requireAccess && isCollectorReady && !canAccessDD) {
      return navigate("/");
    }
  }, [isCollectorReady]);
};

export default useAccessDDGuard;
