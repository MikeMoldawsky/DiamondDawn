import React, { useCallback, useState } from "react";
import classNames from "classnames";
import useWindowDimensions from "hooks/useWindowDimensions";
import { createVideoSources, getCDNVideoUrl } from "utils";
import InlineVideo from "components/VideoPlayer/InlineVideo";

const DEFAULT_MIN_WIDTH = 1025;
const SHOW_TEXT_TIME = 100;

export const usePageSizeLimit = (minWidth = DEFAULT_MIN_WIDTH) => {
  const { width } = useWindowDimensions();

  return width >= minWidth;
};

const PageSizeLimit = ({ minWidth = DEFAULT_MIN_WIDTH, children }) => {
  const showContent = usePageSizeLimit(minWidth);
  const [showText, setShowText] = useState(false);

  setTimeout(() => {
    setShowText(true);
  }, SHOW_TEXT_TIME);

  const renderInlineVideo = useCallback(
    () => (
      <InlineVideo src={createVideoSources("diamond-evolution")} muted={true} />
    ),
    []
  );

  if (showContent) return children;

  return (
    <div className={classNames("center-aligned-column page-cover size-limit")}>
      <div className="leading-text">DIAMOND DAWN</div>
      <div className="secondary-text">
        Mobile version coming soon!
        <br />
        For the full experience please visit Diamond Dawn on a computer
      </div>
      <div className="video-box">{renderInlineVideo()}</div>
    </div>
  );
};

export default PageSizeLimit;
