import React, { useEffect, useState } from "react";
import "./Invite.scss";
import { useDispatch, useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";
import RequestForm from "components/RequestForm";
import useOnConnect from "hooks/useOnConnect";
import { useAccount } from "wagmi";
import useActionDispatch from "hooks/useActionDispatch";
import {
  clearActionStatus,
  isActionFirstCompleteSelector,
} from "store/actionStatusReducer";
import {
  clearInvite,
  inviteSelector,
  loadInviteByAddress,
  openInvite,
} from "store/inviteReducer";
import { SYSTEM_STAGE } from "consts";
import Loading from "components/Loading";
import EnterMine from "pages/ProcessPage/EnterMine";
import RequestSubmittedModal from "components/RequestSubmittedModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import ReactPlayer from "react-player";
import { getCDNVideoUrl } from "utils";

const Invite = () => {
  const { systemStage } = useSelector(systemSelector);
  const actionDispatch = useActionDispatch();
  const dispatch = useDispatch();
  const account = useAccount();
  const invite = useSelector(inviteSelector);
  const isInviteFetched = useSelector(
    isActionFirstCompleteSelector("get-invite-by-address")
  );
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);

  const loadInvite = async (address) => dispatch(loadInviteByAddress(address));

  const onSubmitSuccess = () => {
    setShowSubmittedModal(true);
    loadInvite(account.address);
  };

  const clearInviteState = () => {
    dispatch(clearInvite());
    dispatch(clearActionStatus("get-invite-by-address"));
  };

  useOnConnect(
    async (address) => {
      clearInviteState();
      actionDispatch(() => loadInvite(address), "get-invite-by-address");
    },
    () => {
      clearInviteState();
    }
  );

  useEffect(() => {
    return clearInviteState;
  }, []);

  useEffect(() => {
    if (invite?.approved && !invite?.opened) {
      dispatch(openInvite(invite._id, account.address));
    }
  }, [invite?.approved, invite?.opened]);

  if (systemStage > SYSTEM_STAGE.KEY) return null;

  if (!isInviteFetched || (invite.approved && !invite.opened))
    return (
      <div className="box-content opaque box-loading">
        <Loading />
      </div>
    );

  if (invite.used)
    return (
      <div className="box-content opaque">
        <div className="center-center-aligned-row secondary-text">
          Invitations Used
        </div>
      </div>
    );

  if (invite.revoked)
    return (
      <div className="box-content opaque">
        <div className="center-center-aligned-row secondary-text">
          Invitations Expired
        </div>
      </div>
    );

  if (invite.approved)
    return (
      <div className="box-content approved">
        <EnterMine invite={invite} />
      </div>
    );

  return (
    <div className="box-content opaque invite-view">
      <div className="layout-box">
        <div className="image-box">
          <ReactPlayer
            url={getCDNVideoUrl(
              invite ? "embedded-diamonds.webm" : "diamond-evolution.webm"
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
          {invite ? (
            <div className="left-centered-aligned-column request-status">
              <div className="leading-text">DIAMOND DAWN APPLICATION</div>
              <div className="secondary-text">STATUS: PENDING APPROVAL</div>
              <div className="text-comment">
                Once your request is approved, you will have a limited time to
                enter the mine. Remember, only 333 will embark on the journey
                toward a Diamond Dawn. Will you be among them?
              </div>
              {!showSubmittedModal && (
                <div className="button gold icon-after">
                  Follow <FontAwesomeIcon icon={faTwitter} />
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
              <RequestForm onSuccess={onSubmitSuccess} />
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
