import React, {useCallback, useEffect} from "react";
import Loading from "components/Loading";
import useWaitFor from "hooks/useWaitFor";
import AnimatedLogo from "components/AnimatedLogo";

export const WaitFor = ({
  actions,
  videos = [],
  onReady,
  withLoader = true,
  Loader = () => <Loading />,
  containerClassName,
  children,
}) => {
  const contentReady = useWaitFor({ actions, videos });

  useEffect(() => {
    if (contentReady) {
      onReady && onReady();
    }
  }, [contentReady]);

  const renderLoader = useCallback(() => <Loader />, [])

  const renderLoading = () =>
    !!containerClassName ? (
      <div className={containerClassName}>
        {renderLoader()}
      </div>
    ) : renderLoader();

  return (
    <>
      {(contentReady || videos.length > 0) && children}
      {withLoader && !contentReady && renderLoading()}
    </>
  );
};

export default WaitFor;
