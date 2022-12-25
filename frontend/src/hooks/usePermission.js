import React from "react";
import { isPrivateSale } from "utils";
import { useSelector } from "react-redux";
import { collectorSelector } from "store/collectorReducer";
import { uiSelector } from "store/uiReducer";
import { isActionFirstCompleteSelector } from "store/actionStatusReducer";
import { useAccount } from "wagmi";

const usePermission = () => {
  const isCollectorFetched = useSelector(
    isActionFirstCompleteSelector("get-collector-by-address")
  );
  const collector = useSelector(collectorSelector);
  const { privateSaleAuth } = useSelector(uiSelector);
  const privateSale = isPrivateSale();

  // only relevant for private sale
  if (!privateSale) return true;

  // collector's permission
  if (isCollectorFetched && !!collector) return true;

  // entered with password
  return privateSaleAuth;
};

export default usePermission;