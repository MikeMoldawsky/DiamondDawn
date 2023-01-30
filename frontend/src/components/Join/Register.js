import React, { useCallback } from "react";
import ApplyForm from "components/ApplyForm";
import { useAccount } from "wagmi";
import { createVideoSources } from "utils";
import InlineVideo from "components/VideoPlayer/InlineVideo";
import { Desktop, MobileOrTablet } from "hooks/useMediaQueries";

const Register = ({ onSubmitSuccess }) => {
  const videoSrc = createVideoSources("diamond-evolution");

  const renderInlineVideo = useCallback(
    () => <InlineVideo src={videoSrc} withLoader />,
    [videoSrc]
  );

  const renderTitle = () => (
    <>
      <div className="leading-text">REGISTER TO DIAMOND DAWN</div>
      <div className="text">Please fill the details below</div>
    </>
  );

  return (
    <div className="box-content opaque invite-view">
      <div className="layout-box">
        <MobileOrTablet>{renderTitle()}</MobileOrTablet>
        <div className="video-box">{renderInlineVideo()}</div>
        <div className="content-box">
          <Desktop>{renderTitle()}</Desktop>
          <ApplyForm onSuccess={onSubmitSuccess} />
        </div>
      </div>
    </div>
  );
};

export default Register;
