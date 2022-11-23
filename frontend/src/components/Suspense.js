import React from "react";
import { useSelector } from "react-redux";
import reduce from "lodash/reduce";
import isString from "lodash/isString";
import {
  isActionFirstCompleteSelector,
  isActionSuccessSelector,
} from "store/actionStatusReducer";
import Loading from "components/Loading";
import { useAccount } from "wagmi";
import NotConnected from "components/NotConnected";
import useVideoLoader from "hooks/useVideoLoader";

export const useActionsReady = (actions) => {
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

export const Suspense = ({ actions, videos = [], withLoader, containerClassName, children }) => {
  const account = useAccount();

  const actionsReady = useActionsReady(actions);
  const videosReady = useVideoLoader(videos)

  if (!account?.address) return <NotConnected />;

  const contentReady = actionsReady && videosReady

  const renderLoading = () => !!containerClassName ? (
    <div className={containerClassName}>
      <Loading />
    </div>
  ) : <Loading />

  return (
    <>
      {(actionsReady || videos.length > 0) && children}
      {withLoader && !contentReady && renderLoading()}
    </>
  )
};

export default Suspense;
