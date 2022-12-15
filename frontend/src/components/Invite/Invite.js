import React, { useCallback, useEffect, useState } from "react";
import "./Invite.scss";
import { useDispatch, useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";
import ApplyForm from "components/ApplyForm";
import { useAccount } from "wagmi";
import { inviteSelector, loadInviteById } from "store/inviteReducer";
import { SYSTEM_STAGE } from "consts";
import MintKey from "components/MintKey";
import RequestSubmittedModal from "components/RequestSubmittedModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { createVideoSources } from "utils";
import {
  collectorSelector,
  loadCollectorByAddress,
  openMintWindow,
} from "store/collectorReducer";
import { TwitterLink } from "components/Links";
import InlineVideo from "components/VideoPlayer/InlineVideo";
import useSound from "use-sound";
import sparklesSFX from "assets/audio/end-sparkles.mp3";
import MintAddressRow from "components/MintAddressRow";
import { Desktop, MobileOrTablet } from "hooks/useMediaQueries";

const Invite = () => {
  const { systemStage } = useSelector(systemSelector);
  const dispatch = useDispatch();
  const account = useAccount();
  const invite = useSelector(inviteSelector);
  const collector = useSelector(collectorSelector);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);
  const [playSparklesSFX] = useSound(sparklesSFX);

  const loadInvite = async () => invite && dispatch(loadInviteById(invite._id));
  const loadCollector = async (address) =>
    dispatch(loadCollectorByAddress(address));

  const onSubmit = () => setSubmitting(true);

  const onSubmitSuccess = (address) => {
    setSubmitting(false);
    setShowSubmittedModal(true);
    playSparklesSFX();
    loadCollector(address);
    loadInvite();
  };

  const onSubmitError = () => setSubmitting(false);

  useEffect(() => {
    if (
      systemStage === SYSTEM_STAGE.KEY &&
      collector?.approved &&
      !collector?.mintWindowStart
    ) {
      dispatch(openMintWindow(collector._id, account.address));
    }
  }, [systemStage, collector?.approved, collector?.mintWindowStart]);

  const videoSrc = createVideoSources(
    collector ? "embedded-diamonds" : "diamond-evolution"
  );

  const renderInlineVideo = useCallback(
    () => <InlineVideo src={videoSrc} showThreshold={0} />,
    [videoSrc]
  );

  if (systemStage > SYSTEM_STAGE.KEY) return null;

  if (collector?.mintClosed) {
    return (
      <div className="box-content opaque">
        <div className="center-center-aligned-row tagline-text">
          Invitation Expired
        </div>
      </div>
    );
  }

  if (collector?.minted)
    return (
      <div className="box-content opaque">
        <div className="center-center-aligned-row tagline-text">
          Address already minted
        </div>
      </div>
    );

  if (collector?.approved)
    return (
      <div className="box-content approved">
        <MintKey />
      </div>
    );

  const renderTitle = () =>
    collector ? (
      <>
        <div className="leading-text">DIAMOND DAWN APPLICATION</div>
        <div className="tagline-text">STATUS: PENDING APPROVAL</div>
      </>
    ) : (
      <>
        <div className="leading-text">APPLY FOR DIAMOND DAWN</div>
        <div className="text">Please fill the details below</div>
      </>
    );

  const renderTwitterButton = () => (
    <TwitterLink className="button gold icon-after">
      Follow <FontAwesomeIcon icon={faTwitter} />
    </TwitterLink>
  )

  return (
    <div className="box-content opaque invite-view">
      <div className="layout-box">
        <MobileOrTablet>{renderTitle()}</MobileOrTablet>
        <div className="video-box">{renderInlineVideo()}</div>
        <div className="content-box">
          {collector ? (
            <div className="left-spaced-aligned-column request-status">
              <div className="left-top-aligned-column">
                <Desktop>{renderTitle()}</Desktop>
                <div className="text-comment">
                  If you're accepted to Diamond Dawn, you'll have exactly
                  <b> 3 days, 3 hours, and 3 minutes</b> to mint your key for
                  4.44 ETH.
                </div>
              </div>
              <div className="center-spaced-column bottom-content">
                <div className="center-aligned-row follow-box">
                  <div className="follow-text">
                    <b>
                      Make sure to follow request{" "}
                      <TwitterLink className="text-gold">
                        <b>@DiamondDawnNFT</b>
                      </TwitterLink>
                    </b>{" "}
                    <MobileOrTablet>{renderTwitterButton()}</MobileOrTablet>
                    <span>We’ll send you a Twitter DM if you are accepted.</span>
                  </div>
                  <Desktop>{renderTwitterButton()}</Desktop>
                </div>
                <MintAddressRow />
              </div>
            </div>
          ) : (
            <>
              <Desktop>{renderTitle()}</Desktop>
              <ApplyForm
                disabled={submitting}
                onSubmit={onSubmit}
                onSuccess={onSubmitSuccess}
                onError={onSubmitError}
              />
            </>
          )}
          {showSubmittedModal && (
            <RequestSubmittedModal close={() => setShowSubmittedModal(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Invite;
