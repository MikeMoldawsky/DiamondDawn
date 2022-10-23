import React, { useEffect } from "react";
import "components/Invite/Invite.scss";
import { useDispatch, useSelector } from "react-redux";
import { shortenEthAddress } from "utils";
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

const Invite = () => {
  const { systemStage } = useSelector(systemSelector);
  const actionDispatch = useActionDispatch();
  const dispatch = useDispatch();
  const account = useAccount();
  const invite = useSelector(inviteSelector);
  const isInviteFetched = useSelector(
    isActionFirstCompleteSelector("get-invite-by-address")
  );

  const loadInvite = async (address) => dispatch(loadInviteByAddress(address));

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

  if (systemStage > SYSTEM_STAGE.FORGE) return null

  if (!isInviteFetched || (invite.approved && !invite.opened))
    return (
      <div className="box-content box-loading">
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

  const title = invite ? "REQUEST STATUS" : "JOIN DIAMOND DAWN";

  return (
    <div className="box-content opaque invite-view">
      <div className="layout-box">
        <div className="image-box">
          <div className="image-placeholder" />
          <div className="description">
            A video showing the evolution of the stone? The different types of
            cutting? Something intriguing and mysterious
          </div>
        </div>
        <div className="title-box">
          <div className="secondary-text">
            Hello {shortenEthAddress(account?.address)}
          </div>
        </div>
        <div className="content-box">
          <div className="leading-text">{title}</div>
          <div className="text">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the
          </div>
          {invite ? (
            <div className="request-status">
              <div className="text-comment">Your request has been sent</div>
              <div className="text-comment">STATUS: Pending</div>
            </div>
          ) : (
            <RequestForm onSuccess={() => loadInvite(account.address)} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Invite;
