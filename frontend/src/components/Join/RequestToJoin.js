import React, { useCallback } from "react";
import ApplyForm from "components/ApplyForm";
import { useAccount } from "wagmi";
import { createVideoSources } from "utils";
import InlineVideo from "components/VideoPlayer/InlineVideo";
import { Desktop, MobileOrTablet } from "hooks/useMediaQueries";
import { useSelector } from "react-redux";
import { inviteSelector } from "store/inviteReducer";

const RequestToJoin = ({ onSubmitSuccess }) => {
  const invite = useSelector(inviteSelector);
  const isPreApproved = invite?.inviter?.trusted;

  const videoSrc = createVideoSources("diamond-evolution");

  const renderInlineVideo = useCallback(
    () => <InlineVideo src={videoSrc} withLoader />,
    [videoSrc]
  );

  const renderTitle = () => {
    let titlePrefix = "APPLY FOR"
    if (isPreApproved) {
      titlePrefix = invite?.honoraryInvitee ? "HONORARY" : "JOIN"
    }

    return (
      <>
        <div className="leading-text">
          {titlePrefix} DIAMOND DAWN
        </div>
        <div className="text">Please fill the details below</div>
      </>
    )
  };

  return (
    <div className="box-content opaque invite-view">
      <div className="layout-box">
        <MobileOrTablet>{renderTitle()}</MobileOrTablet>
        <div className="video-box">{renderInlineVideo()}</div>
        <div className="content-box">
          <Desktop>{renderTitle()}</Desktop>
          <ApplyForm
            isPreApproved={isPreApproved}
            onSuccess={onSubmitSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestToJoin;
