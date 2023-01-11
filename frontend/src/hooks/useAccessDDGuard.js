import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import useCanAccessDD from "hooks/useCanAccessDD";
import useCollectorReady from "hooks/useCollectorReady";

const useAccessDDGuard = (requireAccess = true) => {
  const canAccessDD = useCanAccessDD();
  const navigate = useNavigate();
  const isCollectorReady = useCollectorReady();

  // navigate out if doesn't have access
  useEffect(() => {
    if (requireAccess && isCollectorReady && !canAccessDD) {
      return navigate("/");
    }
  }, [isCollectorReady]);
};

export default useAccessDDGuard;
