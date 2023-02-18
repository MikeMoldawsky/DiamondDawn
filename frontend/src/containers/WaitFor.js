import React, { useCallback, useEffect, useState } from "react";
import Loading from "components/Loading";
import useWaitFor from "hooks/useWaitFor";
import useTimeout from "hooks/useTimeout";

export const WaitFor = ({
  actions,
  images = [],
  videos = [],
  minWait = 0,
  onReady,
  withLoader = true,
  loaderText,
  Loader = () => <Loading text={loaderText} />,
  containerClassName,
  children,
}) => {
  const contentReady = useWaitFor({ actions, images, videos });
  const [minWaitOver, setMinWaitOver] = useState(minWait === 0);

  const isReady = contentReady && minWaitOver;

  useEffect(() => {
    if (isReady) {
      onReady && onReady();
    }
  }, [isReady]);

  useTimeout(() => {
    if (minWait > 0 && !minWaitOver) {
      setMinWaitOver(true);
    }
  }, minWait);

  const renderLoader = useCallback(() => <Loader />, []);

  const renderLoading = () =>
    !!containerClassName ? (
      <div className={containerClassName}>{renderLoader()}</div>
    ) : (
      renderLoader()
    );

  return (
    <>
      {(isReady || videos.length > 0) && children}
      {withLoader && !isReady && renderLoading()}
    </>
  );
};

export default WaitFor;
