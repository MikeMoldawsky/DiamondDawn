import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { inviteSelector, loadInviteByAddress } from "store/inviteReducer";
import Countdown from "components/Countdown";
import { useAccount } from "wagmi";
import { NavLink } from "react-router-dom";
import { isStageActiveSelector } from "store/systemReducer";
import { SYSTEM_STAGE } from "consts";

const InviteStatus = () => {
  const isInvitesStage = useSelector(isStageActiveSelector(SYSTEM_STAGE.FORGE));
  const invite = useSelector(inviteSelector);
  const dispatch = useDispatch();
  const account = useAccount();

  if (!isInvitesStage || !invite || invite.used || invite.revoked) return null;

  const renderContent = () => {
    if (invite.opened)
      return (
        <>
          <div>
            You have opened your invitation and didn't get your entry ticket
          </div>
          <Countdown
            date={invite.expires}
            text={["Expires in"]}
            onComplete={() => dispatch(loadInviteByAddress(account.address))}
            renderParts={{
              days: true,
              hours: true,
              minutes: true,
              seconds: true,
            }}
          />
          <NavLink to={`/invite/${invite._id}`}>
            <div className="button">GET ENTRY TICKET</div>
          </NavLink>
        </>
      );
    if (invite.approved)
      return (
        <>
          <div>You are invited</div>
          <NavLink to={`/invite/${invite._id}`}>
            <div className="button">SEE INVITATION</div>
          </NavLink>
        </>
      );
    return <div>Your invitation is pending</div>;
  };

  return <div className="invite-status">{renderContent()}</div>;
};

export default InviteStatus;
