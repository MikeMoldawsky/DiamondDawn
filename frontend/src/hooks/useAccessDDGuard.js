import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { isActionFirstCompleteSelector } from "store/actionStatusReducer";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import usePermission from "hooks/usePermission";

const useAccessDDGuard = (requireAccess = true) => {
  const canAccessDD = usePermission();
  const isCollectorFetched = useSelector(
    isActionFirstCompleteSelector("get-collector-by-address")
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
