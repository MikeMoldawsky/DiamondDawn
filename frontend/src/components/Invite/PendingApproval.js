import React, { useCallback, useState } from "react";
import { useAccount } from "wagmi";
import RequestSubmittedModal from "components/RequestSubmittedModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { createVideoSources } from "utils";
import { TwitterLink } from "components/Links";
import InlineVideo from "components/VideoPlayer/InlineVideo";
import MintAddressRow from "components/MintAddressRow";
import {
  Desktop,
  MobileOrTablet,
  useMobileOrTablet,
} from "hooks/useMediaQueries";
import { StageCountdownWithText } from "components/Countdown/Countdown";
import classNames from "classnames";
import IncreaseChances from "components/IncreaseChances";

const PendingApproval = ({ showModal }) => {
  const [showSubmittedModal, setShowSubmittedModal] = useState(showModal);
  const isMobileOrTablet = useMobileOrTablet();

  const videoSrc = createVideoSources(
    isMobileOrTablet ? "embedded-diamonds-wide" : "embedded-diamonds"
  );

  const renderInlineVideo = useCallback(
    () => <InlineVideo src={videoSrc} showThreshold={0} />,
    [videoSrc]
  );

  const renderTitle = () => (
    <>
      <div className="leading-text">DIAMOND DAWN APPLICATION</div>
      <div className="tagline-text">STATUS: PENDING APPROVAL</div>
    </>
  );

  const renderTwitterButton = (className) => (
    <TwitterLink
      className={classNames("no-hover button gold icon-after", className)}
    >
      Follow <FontAwesomeIcon icon={faTwitter} />
    </TwitterLink>
  );

  return (
    <div className="box-content opaque invite-view">
      <div className="layout-box">
        <MobileOrTablet>{renderTitle()}</MobileOrTablet>
        <div className="video-box">{renderInlineVideo()}</div>
        <div className="content-box">
          <div className="left-spaced-aligned-column request-status">
            <div className="left-top-aligned-column">
              <Desktop>{renderTitle()}</Desktop>
              <div className="text-comment">
                If you're accepted to Diamond Dawn, you'll have exactly
                <b> 3 days, 3 hours, and 3 minutes</b> to mint your key for 4.44
                ETH. Make sure you follow{" "}
                <TwitterLink className="text-gold">
                  <b>@DiamondDawnNFT</b>
                </TwitterLink>
                .
              </div>
            </div>
            <div className="center-spaced-column bottom-content">
              <div className="center-aligned-row cta-row">
                <div className="center-aligned-row">
                  <div className="follow-text">
                    <MobileOrTablet>{renderTwitterButton()}</MobileOrTablet>
                  </div>
                  <Desktop>{renderTwitterButton("lg")}</Desktop>
                </div>
                <StageCountdownWithText />
              </div>
              <MintAddressRow />
            </div>
          </div>
          <IncreaseChances />
          {showSubmittedModal && (
            <RequestSubmittedModal close={() => setShowSubmittedModal(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
