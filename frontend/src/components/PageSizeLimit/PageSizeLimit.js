import React, { useCallback, useState } from "react";
import classNames from "classnames";
import useWindowDimensions from "hooks/useWindowDimensions";
import { createVideoSources } from "utils";
import InlineVideo from "components/VideoPlayer/InlineVideo";
import "./PageSizeLimit.scss";

const getMinWidth = () => {
  try {
    return parseInt(process.env.REACT_APP_PAGE_SIZE_LIMIT);
  } catch (e) {
    return 1025;
  }
};
const DEFAULT_MIN_WIDTH = getMinWidth();

export const usePageSizeLimit = (minWidth = DEFAULT_MIN_WIDTH) => {
  const { width } = useWindowDimensions();

  return width >= minWidth;
};

const PageSizeLimit = ({ minWidth = DEFAULT_MIN_WIDTH, children }) => {
  const showContent = usePageSizeLimit(minWidth);

  const renderInlineVideo = useCallback(
    () => (
      <InlineVideo
        src={createVideoSources("diamond-evolution")}
        forceMuted
        showThreshold={0}
      />
    ),
    []
  );

  const renderDDText = useCallback(
    () => (
      <InlineVideo
        withLoader={false}
        className="dd-text"
        src={createVideoSources("dd-text-1440")}
        showThreshold={0}
      />
    ),
    []
  );

  if (showContent) return children;

  return (
    <div className={classNames("center-aligned-column page-size-limit")}>
      <div className="left-top-aligned-column text-content">
        {renderDDText()}
        <div className="tagline-text">The mobile version is coming soon!</div>
        <div className="text">
          For the full experience, please visit Diamond Dawn on a computer.
        </div>
      </div>
      <div className="video-box">{renderInlineVideo()}</div>
    </div>
  );
};

export default PageSizeLimit;
