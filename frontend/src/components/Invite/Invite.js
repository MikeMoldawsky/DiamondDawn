import React, {useCallback, useEffect, useState} from "react";
import "./Invite.scss";
import { useDispatch, useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";
import ApplyForm from "components/ApplyForm";
import { useAccount } from "wagmi";
import { isActionFirstCompleteSelector } from "store/actionStatusReducer";
import { inviteSelector, loadInviteById } from "store/inviteReducer";
import { SYSTEM_STAGE } from "consts";
import Loading from "components/Loading";
import MintKey from "components/MintKey";
import RequestSubmittedModal from "components/RequestSubmittedModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { getCDNVideoUrl } from "utils";
import {
  collectorSelector,
  loadCollectorByAddress,
  openMintWindow,
} from "store/collectorReducer";
import { TwitterLink } from "components/Links";
import InlineVideo from "components/VideoPlayer/InlineVideo";
import useSound from "use-sound";
import sparklesSFX from "assets/audio/end-sparkles.mp3";
import MintAddressRow from 'components/MintAddressRow'

const Invite = () => {
  const { systemStage } = useSelector(systemSelector);
  const dispatch = useDispatch();
  const account = useAccount();
  const invite = useSelector(inviteSelector);
  const collector = useSelector(collectorSelector);
  const isCollectorFetched = useSelector(
    isActionFirstCompleteSelector("get-collector-by-address")
  );

  const [submitting, setSubmitting] = useState(false);
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);
  const [playSparklesSFX] = useSound(sparklesSFX);

  const loadInvite = async () => invite && dispatch(loadInviteById(invite._id));
  const loadCollector = async (address) =>
    dispatch(loadCollectorByAddress(address));

  const onSubmit = () => setSubmitting(true)

  const onSubmitSuccess = () => {
    loadCollector(account.address);
    loadInvite();
  };

  const onSubmitError = () => setSubmitting(false)

  useEffect(() => {
    if (submitting && collector?._id) {
      setSubmitting(false)
      setShowSubmittedModal(true);
      playSparklesSFX();
    }
  }, [submitting, collector?._id])

  useEffect(() => {
    if (
      systemStage === SYSTEM_STAGE.KEY &&
      collector?.approved &&
      !collector?.mintWindowStart
    ) {
      dispatch(openMintWindow(collector._id, account.address));
    }
  }, [systemStage, collector?.approved, collector?.mintWindowStart]);

  const videoSrc = getCDNVideoUrl(
    collector ? "embedded-diamonds.webm" : "diamond-evolution.webm"
  )

  const renderInlineVideo = useCallback(() => (
    <InlineVideo src={videoSrc} />
  ), [videoSrc])

  if (systemStage > SYSTEM_STAGE.KEY) return null;

  if (!isCollectorFetched)
    return (
      <div className="box-content opaque box-loading">
        <Loading />
      </div>
    );

  if (collector?.mintClosed) {
    return (
      <div className="box-content opaque">
        <div className="center-center-aligned-row secondary-text">
          Invitation Expired
        </div>
      </div>
    );
  }

  if (collector?.minted)
    return (
      <div className="box-content opaque">
        <div className="center-center-aligned-row secondary-text">
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

  return (
    <div className="box-content opaque invite-view">
      <div className="layout-box">
        <div className="image-box">
          {renderInlineVideo()}
        </div>

        <div className="content-box">
          {collector ? (
            <div className="left-spaced-aligned-column request-status">
              <div className="left-top-aligned-column">
                <div className="leading-text">DIAMOND DAWN APPLICATION</div>
                <div className="secondary-text">STATUS: PENDING APPROVAL</div>
                <div className="text-comment">
                  If you're accepted to Diamond Dawn, you'll have exactly
                  <b> 3 days, 3 hours, and 3 minutes</b> to activate your key
                  (mint) for 3.33 $ETH.
                </div>
              </div>
              {!showSubmittedModal && (
                <div className="center-spaced-column bottom-content">
                  <div className="center-aligned-row follow-box">
                    <div className="follow-text">
                      <b>
                        Make sure to follow request{" "}
                        <TwitterLink className="text-gold">
                          <b>@DiamondDawnNFT</b>
                        </TwitterLink>
                      </b>
                      <br />
                      We’ll send you a Twitter DM if you are accepted.
                    </div>
                    <TwitterLink className="button gold icon-after">
                      Follow <FontAwesomeIcon icon={faTwitter} />
                    </TwitterLink>
                  </div>
                  <MintAddressRow />
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="leading-text">APPLY FOR DIAMOND DAWN</div>
              <div className="text">Please fill the details below</div>
              <ApplyForm disabled={submitting} onSubmit={onSubmit} onSuccess={onSubmitSuccess} onError={onSubmitError} />
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
