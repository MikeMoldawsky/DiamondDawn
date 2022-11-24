import React from "react";
import Loading from "components/Loading";
import useWaitFor from "hooks/useWaitFor";

export const WaitFor = ({
  actions,
  videos = [],
  withLoader = true,
  containerClassName,
  children,
}) => {
  const contentReady = useWaitFor({ actions, videos });

  const renderLoading = () =>
    !!containerClassName ? (
      <div className={containerClassName}>
        <Loading />
      </div>
    ) : (
      <Loading />
    );

  return (
    <>
      {(contentReady || videos.length > 0) && children}
      {withLoader && !contentReady && renderLoading()}
    </>
  );
};

export default WaitFor;
