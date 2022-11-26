import React, {useEffect} from "react";
import Loading from "components/Loading";
import useWaitFor from "hooks/useWaitFor";

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
      onReady && onReady()
    }
  }, [contentReady])

  const renderLoading = () =>
    !!containerClassName ? (
      <div className={containerClassName}>
        <Loader />
      </div>
    ) : (
      <Loader />
    );

  return (
    <>
      {(contentReady || videos.length > 0) && children}
      {withLoader && !contentReady && renderLoading()}
    </>
  );
};

export default WaitFor;
