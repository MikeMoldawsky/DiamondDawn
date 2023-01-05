import React from "react";
import { isInviteOnly } from "utils";
import { useSelector } from "react-redux";
import { collectorSelector } from "store/collectorReducer";
import { uiSelector } from "store/uiReducer";
import { isActionSuccessSelector } from "store/actionStatusReducer";
import { useAccount } from "wagmi";

const useCanAccessDD = () => {
  const isCollectorFetched = useSelector(
    isActionSuccessSelector("get-collector-by-address")
  );
  const collector = useSelector(collectorSelector);
  const { privateSaleAuth } = useSelector(uiSelector);
  const inviteOnly = isInviteOnly();

  // only relevant for private sale
  if (!inviteOnly) return true;

  // collector's permission
  if (isCollectorFetched && !!collector) return true;

  // entered with password
  return privateSaleAuth;
};

export default useCanAccessDD;
