import React, { useEffect, useState } from "react";
import "./Invite.scss";
import { useDispatch, useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";
import ApplyForm from "components/RequestForm";
import useOnConnect from "hooks/useOnConnect";
import { useAccount } from "wagmi";
import useActionDispatch from "hooks/useActionDispatch";
import {
  clearActionStatus,
  isActionFirstCompleteSelector,
} from "store/actionStatusReducer";
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
  const actionDispatch = useActionDispatch();
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

  useOnConnect(
    async (address) => {
      // dispatch(clearActionStatus("get-collector-by-address"));
      actionDispatch(() => loadCollector(address), "get-collector-by-address");
      actionDispatch(() => loadInvite(), "get-invite-by-id");
    },
    () => {
      dispatch(clearActionStatus("get-collector-by-address"));
    }
  );

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
                <div className="left-top-aligned-column">
                  <div className="follow-text">
                    * Make sure to follow request <b>@DiamondDawnNFT</b> - we’ll
                    send you a Twitter DM if you are accepted.
                  </div>
                  <div className="button gold icon-after">
                    Follow <FontAwesomeIcon icon={faTwitter} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="title-box">
                <div className="leading-text">APPLY FOR DIAMOND DAWN</div>
              </div>
              <div className="text">
                To receive your unique key to the diamond mine, Please enter
                your info below:
              </div>
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
