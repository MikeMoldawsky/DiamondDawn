import React, { useCallback, useState } from "react";
import "./ComingSoonPage.scss";
import ReactPlayer from "react-player";
import { getCDNImageUrl, getCDNVideoUrl } from "utils";
import classNames from "classnames";
import useMusic from "hooks/useMusic";
import Page from "containers/Page";
import useWindowDimensions from "hooks/useWindowDimensions";
import InlineVideo from "components/VideoPlayer/InlineVideo";
import { getDDTextVideo, getMobileBGVideo } from "assets/videos";
import ActionButton from "components/ActionButton";

const ComingSoonPage = () => {
  const [pageReady, setPageReady] = useState(false);
  const [videoProgress, setVideoProgress] = useState({});
  const { width, height } = useWindowDimensions();

  useMusic("homepage.mp3");

  const bgVideoUrl =
    height > width
      ? getMobileBGVideo(width)
      : getCDNVideoUrl("coming-soon-2-loops.mp4");

  const renderBgPlayer = useCallback(() => {
    return (
      <ReactPlayer
        url={bgVideoUrl}
        playing
        playsinline
        controls={false}
        className="react-player bg-video"
        muted
        loop
        width=""
        height=""
        onProgress={setVideoProgress}
      />
    );
  }, [JSON.stringify(bgVideoUrl)]);

  return (
    <Page
      pageName="coming-soon"
      requireAccess={false}
      images={[getCDNImageUrl("envelop-wings.png")]}
      videos={[{ progress: videoProgress, threshold: 0.1 }]}
      onReady={() => setPageReady(true)}
      collectorLoader={false}
    >
      <div className={classNames("page coming-soon")}>
        {renderBgPlayer()}
        <div className="project-title">
          <InlineVideo className="dd-text" src={getDDTextVideo(width)} />
          <div className="center-center-aligned-row tagline-text ps-row">
            Invite Only. Coming Soon.
          </div>
        </div>
        <div className="center-aligned-column bottom-section">
          <div className="tagline-text text-white">
            Evolve your NFT into a physical diamond
          </div>
          <ActionButton
            actionKey="Enter Diamond Dawn"
            className="transparent lg"
            disabled={true}
            sfx="explore"
          >
            ENTER
          </ActionButton>
        </div>
      </div>
    </Page>
  );
};

export default ComingSoonPage;
