import React from "react"
import {useSelector} from "react-redux";
import {isActionFirstCompleteSelector, isActionSuccessSelector} from "store/actionStatusReducer";
import {ACTION_KEYS} from "consts";
import {useAccount} from "wagmi";

const useCollectorReady = (firstComplete) => {
  const selector = firstComplete ? isActionFirstCompleteSelector : isActionSuccessSelector
  const collectorFetched = useSelector(selector(ACTION_KEYS.GET_COLLECTOR_BY_ADDRESS))
  const account = useAccount()

  return !account.address || collectorFetched
}

export default useCollectorReady