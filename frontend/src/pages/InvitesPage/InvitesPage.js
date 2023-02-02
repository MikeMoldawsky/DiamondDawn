import React, { useCallback } from "react";
import classNames from "classnames";
import { Desktop } from "hooks/useMediaQueries";
import CollectorLayout from "pages/layouts/CollectorLayout";
import { createVideoSources } from "utils";
import InvitesView from "components/InvitationsStatus/InvitesView";
import InlineVideo from "components/VideoPlayer/InlineVideo";
import "components/MintKey/MintKey.scss";

const InvitesPage = () => {
  const renderHandAndKeyVideo = useCallback(() => {
    return (
      <div className="image-box">
        <InlineVideo src={createVideoSources("hand-2-keys")} />
      </div>
    );
  }, []);

  return (
    <CollectorLayout>
      <div className="box-content">
        <div className={classNames("action-view enter")}>
          <div className="layout-box">
            <Desktop>{renderHandAndKeyVideo()}</Desktop>
            <div className="content-box">
              <InvitesView />
            </div>
          </div>
        </div>
      </div>
    </CollectorLayout>
  );
};

export default InvitesPage;
