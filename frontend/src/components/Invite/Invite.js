import React, { useEffect, useState } from "react";
import "./Invite.scss";
import { useDispatch, useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";
import ApplyForm from "components/ApplyForm";
import { useAccount } from "wagmi";
import { isActionFirstCompleteSelector } from "store/actionStatusReducer";
import { inviteSelector, loadInviteById } from "store/inviteReducer";
import { SYSTEM_STAGE } from "consts";
import Loading from "components/Loading";
import EnterMine from "pages/ProcessPage/EnterMine";
import RequestSubmittedModal from "components/RequestSubmittedModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import ReactPlayer from "react-player";
import { getCDNVideoUrl } from "utils";
import {
  collectorSelector,
  loadCollectorByAddress,
  openMintWindow,
} from "store/collectorReducer";

const Invite = () => {
  const { systemStage } = useSelector(systemSelector);
  const dispatch = useDispatch();
  const account = useAccount();
  const invite = useSelector(inviteSelector);
  const collector = useSelector(collectorSelector);
  const isCollectorFetched = useSelector(
    isActionFirstCompleteSelector("get-collector-by-address")
  );

  const [showSubmittedModal, setShowSubmittedModal] = useState(false);

  const loadInvite = async () => invite && dispatch(loadInviteById(invite._id));
  const loadCollector = async (address) =>
    dispatch(loadCollectorByAddress(address));

  const onSubmitSuccess = () => {
    setShowSubmittedModal(true);
    loadCollector(account.address);
    loadInvite();
  };

  useEffect(() => {
    if (
      systemStage === SYSTEM_STAGE.KEY &&
      collector?.approved &&
      !collector?.mintWindowStart
    ) {
      dispatch(openMintWindow(collector._id, account.address));
    }
  }, [systemStage, collector?.approved, collector?.mintWindowStart]);

  if (systemStage > SYSTEM_STAGE.KEY) return null;

  if (!isCollectorFetched)
    return (
      <div className="box-content opaque box-loading">
        <Loading />
      </div>
    );

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
        <EnterMine />
      </div>
    );

  return (
    <div className="box-content opaque invite-view">
      <div className="layout-box">
        <div className="image-box">
          <ReactPlayer
            url={getCDNVideoUrl(
              collector ? "embedded-diamonds.webm" : "diamond-evolution.webm"
            )}
            playing
            playsinline
            controls={false}
            className="react-player"
            loop
            width="100%"
            height="100%"
          />
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
                  for 3.33 $ETH.
                </div>
              </div>
              {!showSubmittedModal && (
                <div className="center-aligned-row follow-box">
                  <div className="follow-text">
                    <b>Make sure to follow request <span className="text-gold"><b>@DiamondDawnNFT</b></span></b><br/>
                    We’ll send you a Twitter DM if you are accepted.
                  </div>
                  <div className="button gold icon-after">
                    Follow <FontAwesomeIcon icon={faTwitter} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="leading-text">APPLY FOR DIAMOND DAWN</div>
              <div className="text">Please fill the details below</div>
              <ApplyForm onSuccess={onSubmitSuccess} />
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
