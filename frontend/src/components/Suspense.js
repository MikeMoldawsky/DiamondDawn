import React from "react";
import { useSelector } from "react-redux";
import reduce from "lodash/reduce";
import isString from "lodash/isString";
import {
  isActionFirstCompleteSelector,
  isActionSuccessSelector,
} from "store/actionStatusReducer";
import Loading from "components/Loading";
import {useAccount} from "wagmi";
import NotConnected from "components/NotConnected";

export const useIsReady = (actions) => {
  return useSelector((state) => {
    return reduce(
      actions,
      (isReady, action) => {
        let isActionReady;
        if (isString(action)) {
          isActionReady = isActionSuccessSelector(action)(state);
        } else {
          const { key, isFirstComplete } = action;
          isActionReady = isFirstComplete
            ? isActionFirstCompleteSelector(key)(state)
            : isActionSuccessSelector(key)(state);
        }

        return isReady && isActionReady;
      },
      true
    );
  });
};

export const Suspense = ({ actions, withLoader, viewName, children }) => {
  const account = useAccount();

  const isReady = useIsReady(actions);

  if (!account?.address) return (
    <NotConnected viewName={viewName} />
  )
  if (isReady) return children;
  if (withLoader) return (
    <div className="box-content">
      <Loading />
    </div>
  );
  return null;
};

export default Suspense;